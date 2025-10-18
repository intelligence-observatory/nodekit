from decimal import Decimal
from typing import List, Iterable

from boto3.session import Session


from nodekit.experimental.recruitment_services.base import (
    RecruiterServiceClient,
    CreateHitRequest,
    CreateHitResponse,
    SendBonusPaymentRequest,
    ListAssignmentsItem,
    RecruiterCredentialsError,
)
import nodekit.experimental.recruitment_services.mechanical_turk.models as boto3_models
from uuid import uuid4

import datetime
import re


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
        current_balance = Decimal(
            self.boto3_client.get_account_balance()["AvailableBalance"]
        )
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
            qual_requirement = self.package_qualification_exists_requirement(
                qual_type=qual_type
            )
            qualification_requirements.append(qual_requirement)

        hit_type_response = self.boto3_client.create_hit_type(
            AutoApprovalDelayInSeconds=24 * 60 * 60,
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
            self.delete_qualification_type(
                qualification_type_id=qual_req.QualificationTypeId
            )

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

            call_return = self.boto3_client.list_workers_with_qualification_type(
                **request_kwargs
            )
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
        return boto3_models.QualificationType.model_validate(
            obj=response["QualificationType"]
        )

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
        self.boto3_client.delete_qualification_type(
            QualificationTypeId=qualification_type_id
        )
