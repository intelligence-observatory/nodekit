import glob
import os
import uuid
from decimal import Decimal
from pathlib import Path
from typing import Iterable

import pydantic

import nodekit as nk
from nodekit.experimental.recruitment_services.base import (
    RecruiterServiceClient,
    CreateHitRequest,
    SendBonusPaymentRequest,
)
from nodekit.experimental.s3 import S3Client

# %%
type HitId = str
type AssignmentId = str
type WorkerId = str


# %%
class TraceResult(pydantic.BaseModel):
    hit_id: HitId
    assignment_id: AssignmentId
    worker_id: WorkerId
    trace: nk.Trace | None  # If None, validation failed


class HitRequest(pydantic.BaseModel):
    graph: nk.Graph
    num_assignments: int
    base_payment_usd: str
    title: str
    duration_sec: int = pydantic.Field(gt=0)
    unique_request_token: str | None
    hit_id: HitId


class Helper:
    """
    Experimental; this might be moved to PsyHub / PsychoScope.
    """

    def __init__(
        self,
        recruiter_service_client: RecruiterServiceClient,
        s3_client: S3Client,
        local_cachedir: os.PathLike | str,
    ):
        self.recruiter_service_client = recruiter_service_client
        self.s3_client = s3_client
        self.local_cachedir = Path(local_cachedir)

    def _get_hit_cachedir(self) -> Path:
        return (
            self.local_cachedir
            / "hits"
            / self.recruiter_service_client.get_recruiter_service_name()
        )

    def create_hit(
        self,
        graph: nk.Graph,
        num_assignments: int,
        base_payment_usd: str,
        title: str,
        duration_sec: int,
        project_name: str,
        unique_request_token: str | None = None,
    ) -> HitId:
        """
        Creates a HIT based on the given Graph.
        Automatically ensures a public site for the Graph exists on S3.
        Caches the HIT (and its Graph) in the local cache.
        """

        graph_site_url = self.upload_graph_site(graph=graph)

        if unique_request_token is None:
            unique_request_token = uuid.uuid4().hex

        response = self.recruiter_service_client.create_hit(
            request=CreateHitRequest(
                entrypoint_url=graph_site_url,
                title=title,
                description=title,
                keywords=["psychology", "task", "cognitive", "science", "game"],
                num_assignments=num_assignments,
                duration_sec=duration_sec,
                completion_reward_usd=Decimal(base_payment_usd),
                unique_request_token=unique_request_token,
                allowed_participant_ids=[],
            )
        )
        hit_id: HitId = response.hit_id

        # Just save the raw wire model, and hope the asset refs don't change. Todo: !
        try:
            hit_request = HitRequest(
                graph=graph,
                num_assignments=num_assignments,
                base_payment_usd=base_payment_usd,
                title=title,
                duration_sec=duration_sec,
                unique_request_token=unique_request_token,
                hit_id=hit_id,
            )
            savepath = self._get_hit_cachedir() / project_name / f"{hit_id}.json"
            if not savepath.parent.exists():
                savepath.parent.mkdir(parents=True)
            savepath.write_text(hit_request.model_dump_json(indent=2))
        except Exception as e:
            raise Exception(f"Could not save Graph for HIT ({hit_id}) to local cache.") from e

        return hit_id

    def list_hits(self, project_name: str | None = None) -> list[HitId]:
        # Just read off the local cache
        savedir = self._get_hit_cachedir()
        savedir.mkdir(parents=True, exist_ok=True)
        hit_ids: list[HitId] = []

        if project_name is None:
            search_results = glob.glob(str(savedir / "**/*.json"), recursive=True)
        else:
            search_results = glob.glob(str(savedir / f"{project_name}/*.json"))

        for path in search_results:
            hit_ids.append(Path(path).stem.split("*.json")[0])
        return hit_ids

    def upload_graph_site(self, graph: nk.Graph) -> str:
        """
        Returns a URL to a public Graph site.
        """

        # Build the Graph site
        build_site_result = nk.build_site(graph=graph, savedir=self.local_cachedir)

        # Ensure index is sync'd
        index_path = build_site_result.site_root / build_site_result.entrypoint
        index_url = self.s3_client.sync_file(
            local_path=index_path,
            local_root=build_site_result.site_root,
            bucket_root="",
            force=False,
        )

        # Ensure deps are sync'd
        for dep in build_site_result.dependencies:
            self.s3_client.sync_file(
                local_path=build_site_result.site_root / dep,
                local_root=build_site_result.site_root,
                bucket_root="",
                force=False,
            )

        return index_url

    def iter_traces(
        self,
        hit_id: HitId,
    ) -> Iterable[TraceResult]:
        """
        Iterate the Traces collected under the given HIT ID.
        Automatically approves any unapproved assignments.
        """

        # Pull new assignments
        for asn in self.recruiter_service_client.iter_assignments(hit_id=hit_id):
            # Ensure assignment is approved
            if asn.status != "Approved":
                self.recruiter_service_client.approve_assignment(
                    assignment_id=asn.assignment_id,
                )
            try:
                trace = nk.Trace.model_validate_json(asn.submission_payload)
            except pydantic.ValidationError:
                print(
                    f"\n\n{asn.assignment_id}: Error validating submission payload:",
                    asn.submission_payload,
                )
                trace = None

            yield TraceResult(
                hit_id=hit_id,
                assignment_id=asn.assignment_id,
                worker_id=asn.worker_id,
                trace=trace,
            )

    def pay_bonus(
        self,
        worker_id: WorkerId,
        assignment_id: AssignmentId,
        amount_usd: str,
    ) -> None:
        self.recruiter_service_client.send_bonus_payment(
            request=SendBonusPaymentRequest(
                assignment_id=assignment_id,
                amount_usd=Decimal(amount_usd),
                worker_id=worker_id,
            )
        )

    def get_hit(
        self,
        hit_id: HitId,
    ) -> HitRequest:
        """
        Loads the Graph associated with the given HIT ID.
        (Hit the local cache)
        """
        savepath = self._get_hit_cachedir() / f"{hit_id}.json"
        if not savepath.parent.exists():
            raise Exception(f"Could not save Graph for HIT {hit_id}.")

        hit_request = HitRequest.model_validate_json(savepath.read_text())
        return hit_request
