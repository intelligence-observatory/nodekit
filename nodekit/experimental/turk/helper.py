import datetime
import re
from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Iterable, List, Literal
from uuid import uuid4

import pydantic
from boto3.session import Session

import nodekit.experimental.turk.models as boto3_models


import os
import uuid
from pathlib import Path
import glob

import nodekit as nk

from nodekit.experimental.s3 import S3Client


# %%
class RecruiterCredentialsError(Exception):
    """Exception raised for errors in the recruiter credentials."""

    ...


# %%
class ListAssignmentsItem(pydantic.BaseModel):
    hit_id: str
    worker_id: str
    assignment_id: str
    status: Literal["Submitted", "Approved", "Rejected"]
    submission_payload: str


class CreateHitRequest(pydantic.BaseModel):
    entrypoint_url: str
    title: str
    description: str
    keywords: List[str]
    num_assignments: int
    duration_sec: int
    completion_reward_usd: Decimal
    allowed_participant_ids: List[str]
    unique_request_token: str


class CreateHitResponse(pydantic.BaseModel):
    hit_id: str


class SendBonusPaymentRequest(pydantic.BaseModel):
    worker_id: str
    assignment_id: str
    amount_usd: Decimal = pydantic.Field(decimal_places=2)


# %%
class RecruiterServiceClient(ABC):
    @abstractmethod
    def get_recruiter_service_name(self) -> str: ...

    @abstractmethod
    def create_hit(
        self,
        request: CreateHitRequest,
    ) -> CreateHitResponse: ...

    @abstractmethod
    def send_bonus_payment(
        self,
        request: SendBonusPaymentRequest,
    ) -> None: ...

    @abstractmethod
    def iter_assignments(
        self,
        hit_id: str,
    ) -> Iterable[ListAssignmentsItem]:
        raise NotImplementedError

    @abstractmethod
    def cleanup_hit(self, hit_id: str) -> None: ...

    @abstractmethod
    def approve_assignment(
        self,
        assignment_id: str,
    ) -> None: ...


# %%


def extract_trace(xml: str) -> str:
    # pull the contents of the <FreeText> element
    m = re.search(r"<FreeText>(.*?)</FreeText>", xml, re.DOTALL)
    if not m:
        raise ValueError("No <FreeText> found")
    raw = m.group(1)

    # MTurk sometimes form-encodes it (+ for space, %xx etc.)
    return raw


# %%
class MturkClient(RecruiterServiceClient):
    def __init__(
        self,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        sandbox: bool,
    ):
        # Initialize MTurk client
        if sandbox:
            endpoint_url = "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        else:
            endpoint_url = "https://mturk-requester.us-east-1.amazonaws.com"

        session = Session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
        )

        self.boto3_client = session.client(
            service_name="mturk", endpoint_url=endpoint_url, region_name="us-east-1"
        )
        self.sandbox = sandbox

        # Try verifying the credentials; throw if invalid:
        try:
            self.boto3_client.get_account_balance()
        except Exception as e:
            raise RecruiterCredentialsError from e

    def get_recruiter_service_name(self) -> str:
        if self.sandbox:
            return "MTurkSandbox"
        else:
            return "MTurk"

    def create_hit(
        self,
        request: CreateHitRequest,
    ) -> CreateHitResponse:
        # Unpack:
        entrypoint_url = request.entrypoint_url
        title = request.title
        description = request.description
        keywords = request.keywords
        num_assignments = request.num_assignments
        duration_sec = request.duration_sec
        completion_reward_usd = request.completion_reward_usd
        allowed_participant_ids = request.allowed_participant_ids

        # Calculate minimum approval cost
        min_approval_cost = (
            completion_reward_usd * Decimal("1.2") * Decimal(num_assignments)
        )  # Turk fees are 20% of the base completion reward.
        current_balance = Decimal(self.boto3_client.get_account_balance()["AvailableBalance"])
        if current_balance < min_approval_cost:
            raise RuntimeError(
                f"Insufficient balance to create HIT. Minimum required: ${min_approval_cost:.2f}, current balance: ${current_balance:.2f}"
            )

        qualification_requirements: List[boto3_models.QualificationRequirement] = []
        if len(allowed_participant_ids) > 0:
            # Create qualification type for this TaskRequest:
            qual_type = self.create_qualification_type(unique_name=f"psy:{uuid4()}")

            # Grant each worker ID the qualification:
            for worker_id in allowed_participant_ids:
                self.grant_qualification(
                    qualification_type_id=qual_type.QualificationTypeId,
                    worker_id=worker_id,
                )

            # Create qualification requirement for this HIT:
            qual_requirement = self.package_qualification_exists_requirement(qual_type=qual_type)
            qualification_requirements.append(qual_requirement)

        hit_type_response = self.boto3_client.create_hit_type(
            AutoApprovalDelayInSeconds=1,
            AssignmentDurationInSeconds=duration_sec,
            Reward=str(completion_reward_usd),
            Title=title,
            Keywords=",".join(keywords),
            Description=description,
            QualificationRequirements=[
                qr.model_dump(mode="json") for qr in qualification_requirements
            ],
        )

        q = (
            f'<ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">'
            f"<ExternalURL>{entrypoint_url}</ExternalURL>"
            f"<FrameHeight>{0}</FrameHeight></ExternalQuestion>"
        )

        hit_info = self.boto3_client.create_hit_with_hit_type(
            HITTypeId=hit_type_response["HITTypeId"],
            Question=q,
            MaxAssignments=num_assignments,
            LifetimeInSeconds=1209600,  # 1209600 seconds = 2 weeks is max allowed by MTurk
            UniqueRequestToken=request.unique_request_token,
            RequesterAnnotation=request.unique_request_token,
        )["HIT"]
        hit = boto3_models.HIT.model_validate(obj=hit_info)

        # Idempotency error: botocore.errorfactory.RequestError: An error occurred (RequestError) when calling the CreateHIT operation: The HIT with ID "{hit_id}" already exists.
        return CreateHitResponse(hit_id=hit.HITId)

    def send_bonus_payment(
        self,
        request: SendBonusPaymentRequest,
    ) -> None:
        unique_request_token = f"{request.worker_id}:{request.assignment_id}"

        try:
            self.boto3_client.send_bonus(
                WorkerId=request.worker_id,
                BonusAmount=str(request.amount_usd),
                AssignmentId=request.assignment_id,
                Reason="Assignment-based bonus.",
                UniqueRequestToken=unique_request_token,  # For idempotency
            )
        except Exception as e:
            if "idempotency" in str(e):
                # Expected error for duplicate request
                pass

    def approve_assignment(self, assignment_id: str) -> None:
        self.boto3_client.approve_assignment(
            AssignmentId=assignment_id,
            OverrideRejection=False,
        )

    def iter_assignments(
        self,
        hit_id: str,
    ) -> Iterable[ListAssignmentsItem]:
        AssignmentStatuses = ["Submitted", "Approved", "Rejected"]

        request_kwargs = dict(
            HITId=hit_id,
            MaxResults=100,
            AssignmentStatuses=AssignmentStatuses,
        )

        # Paginate over boto3 results:
        next_token = ""
        while next_token is not None:
            if next_token != "":
                request_kwargs["NextToken"] = next_token
            else:
                if "NextToken" in request_kwargs:
                    del request_kwargs["NextToken"]

            call_return = self.boto3_client.list_assignments_for_hit(**request_kwargs)
            for asn_info in call_return["Assignments"]:
                assignment = boto3_models.Assignment.model_validate(obj=asn_info)
                item = ListAssignmentsItem(
                    hit_id=assignment.HITId,
                    worker_id=assignment.WorkerId,
                    assignment_id=assignment.AssignmentId,
                    status=assignment.AssignmentStatus,
                    submission_payload=extract_trace(assignment.Answer),
                )

                yield item

            if "NextToken" in call_return:
                next_token = call_return["NextToken"]
            else:
                # Will break
                next_token = None

    def cleanup_hit(self, hit_id: str) -> None:
        # First, retrieve the HIT to ensure it exists
        hit_info = self.boto3_client.get_hit(HITId=hit_id)
        hit = boto3_models.HIT.model_validate(obj=hit_info["HIT"])

        # See if this HIT has any QualificationRequirements
        qual_reqs = hit.QualificationRequirements
        if qual_reqs is not None:
            for qual_req in qual_reqs:
                # Get workers associated with this qualification:
                worker_ids = self.list_workers_with_qualification_type(
                    qual_type_id=qual_req.QualificationTypeId
                )
                # Dissociate any qualifications from workers that were previously granted
                for worker_id in worker_ids:
                    self.boto3_client.disassociate_qualification_from_worker(
                        WorkerId=worker_id,
                        QualificationTypeId=qual_req.QualificationTypeId,
                    )

                # Delete the qualification type
                self.delete_qualification_type(qualification_type_id=qual_req.QualificationTypeId)

        # Update the expiration for the HIT to *now*
        self.boto3_client.update_expiration_for_hit(
            HITId=hit_id, ExpireAt=datetime.datetime.now(tz=datetime.timezone.utc)
        )

    # %% Quals:
    def list_workers_with_qualification_type(
        self,
        qual_type_id: str,
    ) -> List[str]:
        next_token = ""
        request_kwargs = dict(
            QualificationTypeId=qual_type_id,
            Status="Granted",
            MaxResults=100,
        )
        worker_ids = []
        while next_token is not None:
            if next_token != "":
                request_kwargs["NextToken"] = next_token
            else:
                if "NextToken" in request_kwargs:
                    del request_kwargs["NextToken"]

            call_return = self.boto3_client.list_workers_with_qualification_type(**request_kwargs)
            for worker_info in call_return["Qualifications"]:
                worker_ids.append(worker_info["WorkerId"])

            if "NextToken" in call_return:
                next_token = call_return["NextToken"]
            else:
                # Will break
                next_token = None
        return worker_ids

    def create_qualification_type(
        self,
        unique_name: str,
    ) -> boto3_models.QualificationType:
        response = self.boto3_client.create_qualification_type(
            Name=unique_name,
            Description=unique_name,
            QualificationTypeStatus="Active",
        )
        # Validate response:
        return boto3_models.QualificationType.model_validate(obj=response["QualificationType"])

    def package_qualification_exists_requirement(
        self,
        qual_type: boto3_models.QualificationType,
    ) -> boto3_models.QualificationRequirement:
        return boto3_models.QualificationRequirement(
            QualificationTypeId=qual_type.QualificationTypeId,
            Comparator="Exists",
            ActionsGuarded="DiscoverPreviewAndAccept",
        )

    def list_qualification_types(self) -> List[boto3_models.QualificationType]:
        qualification_types = []

        next_token = ""

        call_kwargs = {}
        while next_token is not None:
            res = self.boto3_client.list_qualification_types(
                MustBeRequestable=False,
                MustBeOwnedByCaller=True,
                MaxResults=100,
                **call_kwargs,
            )

            if "NextToken" in res:
                next_token = res["NextToken"]
            else:
                next_token = None

            call_kwargs["NextToken"] = next_token

            qreturn = res["QualificationTypes"]
            for q in qreturn:
                qual_type = boto3_models.QualificationType.model_validate(obj=q)
                qualification_types.append(qual_type)

        return qualification_types

    def grant_qualification(
        self,
        qualification_type_id: str,
        worker_id: str,
        integer_value: int = 1,
    ):
        self.boto3_client.associate_qualification_with_worker(
            QualificationTypeId=qualification_type_id,
            WorkerId=worker_id,
            IntegerValue=integer_value,
            SendNotification=False,
        )

    def revoke_qualification(
        self,
        worker_id: str,
        qualification_type_id: str,
    ):
        try:
            self.boto3_client.disassociate_qualification_from_worker(
                QualificationTypeId=qualification_type_id,
                WorkerId=worker_id,
                Reason="",
            )
        except Exception as e:
            message = str(e)
            if "RequestError" in message:
                print(message)  # todo; already revoked?
            else:
                raise e

    def delete_qualification_type(
        self,
        qualification_type_id: str,
    ):
        self.boto3_client.delete_qualification_type(QualificationTypeId=qualification_type_id)


# %%

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
    ) -> Iterable[nk.SiteSubmission | None]:
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
                site_submission = nk.SiteSubmission.model_validate_json(asn.submission_payload)
            except pydantic.ValidationError:
                print(
                    f"\n\n{asn.assignment_id}: Error validating submission payload:",
                    asn.submission_payload,
                )
                site_submission = None

            yield site_submission

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
