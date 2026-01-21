import os
import uuid
from decimal import Decimal
from pathlib import Path
from typing import Iterable

import nodekit as nk
import pydantic
from nodekit.experimental.s3 import S3Client
from nodekit.experimental.turk.client import CreateHitRequest, MturkClient, SendBonusPaymentRequest
from nodekit.experimental.turk.models import HIT, Assignment

import warnings
import datetime
import glob
import json
import re


# %%
def extract_external_question_answer(xml: str) -> str:
    # pull the contents of the <FreeText> element
    m = re.search(r"<FreeText>(.*?)</FreeText>", xml, re.DOTALL)
    if not m:
        raise ValueError("No <FreeText> found")
    raw = m.group(1)

    # Returns raw content; callers can decode if their submission payloads are encoded.
    return raw


# %%
class MechanicalTurkRecruiter:
    """
    Helper for recruiting participants on Mechanical Turk to run a Graph via a hosted site.
    Builds and uploads Graph sites to S3, creates HITs, caches HIT/assignment metadata,
    approves Submitted assignments, and yields validated site submissions.
    Requires AWS credentials with MTurk access and S3 write/public permissions.
    """

    def __init__(
        self,
        project_directory: os.PathLike | str,
        mturk_sandbox: bool,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        region_name: str,
        s3_bucket_name: str,
    ):
        """
        Initialize MTurk and S3 clients and set the local cache root.

        Args:
            project_directory: Local directory used for HIT/assignment/bonus caches and site builds.
            mturk_sandbox: Whether to use the MTurk sandbox environment.
            aws_access_key_id: AWS access key for MTurk and S3.
            aws_secret_access_key: AWS secret access key for MTurk and S3.
            region_name: AWS region for the S3 bucket.
            s3_bucket_name: S3 bucket used to host Graph sites.
        """
        self.mturk_client = MturkClient(
            sandbox=mturk_sandbox,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
        )
        self.s3_client = S3Client(
            bucket_name=s3_bucket_name,
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
        )
        self._project_directory = Path(project_directory)

    def _get_hit_cachedir(self) -> Path:
        """Return the local directory where HIT metadata is cached.

        Returns:
            Directory path for cached HIT metadata.
        """
        return self._project_directory / "hits" / self.mturk_client.get_recruiter_service_name()

    def _get_assignment_cachedir(
        self,
        hit_id: str,
    ):
        """Return the local directory where assignments for a HIT are cached.

        Args:
            hit_id: HIT ID used to namespace the cache.

        Returns:
            Directory path for cached assignments for the HIT.
        """
        return (
            self._project_directory
            / "assignments"
            / self.mturk_client.get_recruiter_service_name()
            / hit_id
        )

    def _get_assignment_savepath(self, hit_id: str, assignment_id: str) -> Path:
        """Return the JSON cache path for a specific assignment.

        Args:
            hit_id: HIT ID used to namespace the cache.
            assignment_id: MTurk assignment ID.

        Returns:
            File path to the cached assignment JSON.
        """
        return self._get_assignment_cachedir(hit_id=hit_id) / f"{assignment_id}.json"

    def _get_hit_savepath(self, hit_id: str) -> Path:
        """Return the JSON cache path for a specific HIT.

        Args:
            hit_id: MTurk HIT ID.

        Returns:
            File path to the cached HIT JSON.
        """
        return self._get_hit_cachedir() / f"{hit_id}.json"

    def _get_bonus_payments_cachedir(self) -> Path:
        """Return the local directory where bonus payment receipts are cached.

        Returns:
            Directory path for cached bonus payment receipts.
        """
        return (
            self._project_directory
            / "bonus_payments"
            / self.mturk_client.get_recruiter_service_name()
        )

    def _get_graph_site_cachedir(self) -> Path:
        """Return the local directory where Graph sites are built before upload.

        Returns:
            Directory path for built Graph site assets.
        """
        return self._project_directory / "sites"

    def create_hit(
        self,
        graph: nk.Graph,
        num_assignments: int,
        base_payment_usd: str,
        title: str,
        duration_sec: int,
        allowed_participant_ids: list[str] | None = None,
        description: str | None = None,
        keywords: list[str] | None = None,
    ) -> str:
        """
        Create and publish a HIT for a Graph, building and uploading its site to S3.
        Caches the HIT metadata locally and returns the HIT ID.

        Args:
            graph: Graph to host and run.
            num_assignments: Maximum assignments allowed for the HIT.
            base_payment_usd: Base payment per assignment, in USD (string to preserve precision).
            title: HIT title shown to workers.
            duration_sec: Assignment duration in seconds.
            allowed_participant_ids: Optional allowlist of worker IDs.
            description: Optional HIT description (defaults to title).
            keywords: Optional list of keywords (defaults to a NodeKit set).
        """

        graph_site_url = self._upload_graph_site(graph=graph)

        if description is None:
            description = title

        if keywords is None:
            keywords = ["nodekit", "psychology", "task", "cognitive", "science", "game"]

        if allowed_participant_ids is None:
            allowed_participant_ids = []

        request = CreateHitRequest(
            entrypoint_url=graph_site_url,
            title=title,
            description=description,
            keywords=keywords,
            num_assignments=num_assignments,
            duration_sec=duration_sec,
            completion_reward_usd=Decimal(base_payment_usd),
            unique_request_token=uuid.uuid4().hex,
            allowed_participant_ids=allowed_participant_ids,
        )

        hit = self.mturk_client.create_hit(request=request)

        # Cache the HIT info
        savedir = self._get_hit_cachedir()
        savedir.mkdir(parents=True, exist_ok=True)
        hit_savepath = self._get_hit_savepath(hit_id=hit.HITId)
        hit_savepath.write_text(hit.model_dump_json(indent=2))

        return hit.HITId

    def get_hit(self, hit_id: str) -> HIT:
        """
        Return a HIT record, refreshing from MTurk and updating the cache.

        Args:
            hit_id: HIT ID to load.

        Returns:
            HIT model refreshed from MTurk.
        """

        # Read cached HIT info
        hit_savepath = self._get_hit_savepath(hit_id=hit_id)
        if not hit_savepath.exists():
            raise ValueError(f"HIT ID {hit_id} not found in local cache at {hit_savepath}")
        hit_json = hit_savepath.read_text()
        hit = HIT.model_validate_json(hit_json)

        hit = self.mturk_client.get_hit(hit_id=hit_id)

        # Write
        hit_savepath.write_text(hit.model_dump_json(indent=2))

        return hit

    def list_hit_ids(self) -> list[str]:
        """
        List the HIT IDs stored in the local cache.

        Returns:
            A list of HIT IDs derived from cached `{hit_id}.json` files.
        """
        savedir = self._get_hit_cachedir()
        if not savedir.is_dir():
            return []
        return [path.stem for path in savedir.glob("*.json")]

    def _upload_graph_site(self, graph: nk.Graph) -> str:
        """Build the Graph site and upload its assets to S3.

        Args:
            graph: Graph to build and upload.

        Returns:
            Public URL to the site entrypoint.
        """

        # Build the Graph site
        build_site_result = nk.build_site(graph=graph, savedir=self._get_graph_site_cachedir())

        manifest = [build_site_result.entrypoint, *build_site_result.dependencies]
        manifest = list(dict.fromkeys(manifest))
        uploaded = self.s3_client.sync_directory(
            local_root=build_site_result.site_root,
            bucket_root="",
            manifest=[path.as_posix() for path in manifest],
            verbose=True,
        )
        entrypoint_rel = build_site_result.entrypoint.as_posix()
        index_url = uploaded.get(entrypoint_rel)
        if index_url is None:
            raise RuntimeError(
                f"Entrypoint {entrypoint_rel} was not uploaded from {build_site_result.site_root}"
            )

        return index_url

    def iter_site_submissions(
        self,
        hit_id: str | None = None,
    ) -> Iterable[nk.SiteSubmission]:
        """
        Yield validated SiteSubmission payloads for cached assignments.
        If cached assignments are fewer than MTurk's completed count, fetch and cache all.
        Automatically approves Submitted assignments.

        Args:
            hit_id: Optional HIT ID to filter by; if omitted, iterates all cached HITs.
        """

        hit_ids = [hit_id] if hit_id is not None else self.list_hit_ids()

        for hit_id in hit_ids:
            hit = self.get_hit(hit_id=hit_id)

            assignment_cachedir = self._get_assignment_cachedir(hit_id=hit_id)
            assignment_paths = glob.glob(str(assignment_cachedir / "*.json"))

            # Decide whether to pull assignments:
            if len(assignment_paths) < hit.NumberOfAssignmentsCompleted:
                # Pull assignments:
                for asn in self.mturk_client.iter_assignments(hit_id=hit_id):
                    if asn.AssignmentStatus == "Submitted":
                        # This client always approves Submitted Assignments
                        self.mturk_client.approve_assignment(
                            assignment_id=asn.AssignmentId,
                        )

                    # Cache the assignment payload locally
                    savepath = self._get_assignment_savepath(
                        hit_id=hit_id, assignment_id=asn.AssignmentId
                    )
                    savepath.parent.mkdir(parents=True, exist_ok=True)
                    savepath.write_text(asn.model_dump_json(indent=2))

                assignment_paths = glob.glob(str(assignment_cachedir / "*.json"))

            for path in assignment_paths:
                asn_json = Path(path).read_text()
                asn = Assignment.model_validate_json(asn_json)

                submission_payload = extract_external_question_answer(asn.Answer)

                try:
                    site_submission = nk.SiteSubmission.model_validate_json(submission_payload)
                except pydantic.ValidationError as e:
                    warnings.warn(
                        f"\n\nAssignment {asn.AssignmentId}: Error validating submission payload:\n{str(e)[:200]}...\n\n"
                    )
                    continue

                yield site_submission

    def pay_bonus(
        self,
        worker_id: str,
        assignment_id: str,
        amount_usd: str,
    ) -> None:
        """
        Pay a bonus to a worker for a given assignment and write a local receipt.
        Skips payment if a receipt already exists.

        Args:
            worker_id: MTurk worker ID.
            assignment_id: MTurk assignment ID.
            amount_usd: Bonus amount in USD (string to preserve precision).
        """

        # Check if a receipt already exists
        savedir = self._get_bonus_payments_cachedir()
        receipt_path = savedir / f"{assignment_id}_{worker_id}_bonus.json"

        if receipt_path.exists():
            warnings.warn(
                f"Bonus payment receipt already exists at {receipt_path}, skipping bonus payment."
            )
            return

        self.mturk_client.send_bonus_payment(
            request=SendBonusPaymentRequest(
                assignment_id=assignment_id,
                amount_usd=Decimal(amount_usd),
                worker_id=worker_id,
            )
        )

        # Write a receipt
        savedir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
        receipt = {
            "worker_id": worker_id,
            "assignment_id": assignment_id,
            "amount_usd": amount_usd,
            "timestamp": timestamp,
        }

        with open(receipt_path, "w") as f:
            json.dump(receipt, f, indent=4)
