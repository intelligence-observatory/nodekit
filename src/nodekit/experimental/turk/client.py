import datetime
from decimal import Decimal
from typing import Any, Iterable
from xml.sax.saxutils import escape

import pydantic
from boto3.session import Session

import nodekit.experimental.turk.models as boto3_models


# %% Constants
MAX_HIT_LIFETIME_SEC = 1_209_600
MAX_AUTO_APPROVAL_DELAY_SEC = 2_592_000


# %%
class RecruiterCredentialsError(Exception):
    """Exception raised for errors in the recruiter credentials."""

    ...


# %%
class CreateHitRequest(pydantic.BaseModel):
    site_url: str
    title: str
    description: str
    keywords: list[str]
    num_assignments: int = pydantic.Field(gt=0)
    duration_sec: int = pydantic.Field(gt=0)
    completion_reward_usd: Decimal = pydantic.Field(decimal_places=2, ge=0)
    qualification_requirements: tuple[boto3_models.QualificationRequirement, ...] = ()
    unique_request_token: str
    auto_approval_delay_sec: int = pydantic.Field(
        ge=0,
        le=MAX_AUTO_APPROVAL_DELAY_SEC,
    )
    lifetime_sec: int = pydantic.Field(gt=0, le=MAX_HIT_LIFETIME_SEC)
    frame_height_px: int = pydantic.Field(default=0, ge=0)


class SendBonusPaymentRequest(pydantic.BaseModel):
    worker_id: str
    assignment_id: str
    amount_usd: Decimal = pydantic.Field(decimal_places=2)


# %%
class MturkClient:
    def __init__(
        self,
        aws_access_key_id: str | None = None,
        aws_secret_access_key: str | None = None,
        sandbox: bool = True,
        *,
        boto3_client: Any | None = None,
        session: Session | None = None,
        region_name: str = "us-east-1",
        verify_credentials: bool = True,
    ):
        # Initialize MTurk client
        if sandbox:
            endpoint_url = "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        else:
            endpoint_url = "https://mturk-requester.us-east-1.amazonaws.com"

        if boto3_client is None:
            if session is None:
                session = Session(
                    aws_access_key_id=aws_access_key_id,
                    aws_secret_access_key=aws_secret_access_key,
                )

            boto3_client = session.client(
                service_name="mturk",
                endpoint_url=endpoint_url,
                region_name=region_name,
            )

        self.boto3_client = boto3_client
        self.sandbox = sandbox

        # Try verifying the credentials; throw if invalid:
        if verify_credentials:
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
    ) -> boto3_models.HIT:
        # Unpack:
        site_url = request.site_url
        title = request.title
        description = request.description
        keywords = request.keywords
        num_assignments = request.num_assignments
        duration_sec = request.duration_sec
        completion_reward_usd = request.completion_reward_usd

        # Calculate minimum approval cost
        min_approval_cost = (
            completion_reward_usd * Decimal("1.2") * Decimal(num_assignments)
        )  # Turk fees are 20% of the base completion reward.
        current_balance = Decimal(self.boto3_client.get_account_balance()["AvailableBalance"])
        if current_balance < min_approval_cost:
            raise RuntimeError(
                f"Insufficient balance to create HIT. Minimum required: ${min_approval_cost:.2f}, current balance: ${current_balance:.2f}"
            )

        hit_type_response = self.boto3_client.create_hit_type(
            AutoApprovalDelayInSeconds=request.auto_approval_delay_sec,
            AssignmentDurationInSeconds=duration_sec,
            Reward=str(completion_reward_usd),
            Title=title,
            Keywords=",".join(keywords),
            Description=description,
            QualificationRequirements=[
                qr.model_dump(mode="json") for qr in request.qualification_requirements
            ],
        )

        question = package_external_question_xml(
            site_url=site_url,
            frame_height_px=request.frame_height_px,
        )

        hit_info = self.boto3_client.create_hit_with_hit_type(
            HITTypeId=hit_type_response["HITTypeId"],
            Question=question,
            MaxAssignments=num_assignments,
            LifetimeInSeconds=request.lifetime_sec,
            UniqueRequestToken=request.unique_request_token,
            RequesterAnnotation=request.unique_request_token,
        )["HIT"]
        hit = boto3_models.HIT.model_validate(obj=hit_info)

        # Idempotency error: botocore.errorfactory.RequestError: An error occurred (RequestError) when calling the CreateHIT operation: The HIT with ID "{hit_id}" already exists.
        return hit

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
            message = str(e).lower()
            if "idempotency" in message:
                # Expected error for duplicate request
                return
            raise

    def iter_bonus_payments(
        self,
        *,
        hit_id: str | None = None,
        assignment_id: str | None = None,
    ) -> Iterable[boto3_models.BonusPayment]:
        if (hit_id is None) == (assignment_id is None):
            raise ValueError("Provide exactly one of hit_id or assignment_id.")

        request_kwargs: dict[str, str | int] = {
            "MaxResults": 100,
        }
        if hit_id is not None:
            request_kwargs["HITId"] = hit_id
        if assignment_id is not None:
            request_kwargs["AssignmentId"] = assignment_id

        # Paginate over boto3 results:
        next_token = ""
        while next_token is not None:
            if next_token != "":
                request_kwargs["NextToken"] = next_token
            else:
                if "NextToken" in request_kwargs:
                    del request_kwargs["NextToken"]

            call_return = self.boto3_client.list_bonus_payments(**request_kwargs)
            for bonus_payment_info in call_return["BonusPayments"]:
                bonus_payment = boto3_models.BonusPayment.model_validate(
                    obj=bonus_payment_info,
                )
                yield bonus_payment

            if "NextToken" in call_return:
                next_token = call_return["NextToken"]
            else:
                # Will break
                next_token = None

    def approve_assignment(self, assignment_id: str) -> None:
        self.boto3_client.approve_assignment(
            AssignmentId=assignment_id,
            OverrideRejection=False,
        )

    def iter_assignments(
        self,
        hit_id: str,
    ) -> Iterable[boto3_models.Assignment]:
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
                yield assignment

            if "NextToken" in call_return:
                next_token = call_return["NextToken"]
            else:
                # Will break
                next_token = None

    def get_hit(self, hit_id: str) -> boto3_models.HIT:
        hit_info = self.boto3_client.get_hit(HITId=hit_id)
        hit = boto3_models.HIT.model_validate(obj=hit_info["HIT"])
        return hit

    def cleanup_hit(
        self,
        hit_id: str,
    ) -> None:
        # First, retrieve the HIT to ensure it exists
        self.get_hit(hit_id=hit_id)

        # Update the expiration for the HIT to *now*
        self.boto3_client.update_expiration_for_hit(
            HITId=hit_id, ExpireAt=datetime.datetime.now(tz=datetime.timezone.utc)
        )

    # %% Quals:
    def list_workers_with_qualification_type(
        self,
        qual_type_id: str,
    ) -> list[str]:
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
        description: str | None = None,
    ) -> boto3_models.QualificationType:
        response = self.boto3_client.create_qualification_type(
            Name=unique_name,
            Description=description or unique_name,
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

    def package_qualification_does_not_exist_requirement(
        self,
        qual_type: boto3_models.QualificationType,
    ) -> boto3_models.QualificationRequirement:
        return boto3_models.QualificationRequirement(
            QualificationTypeId=qual_type.QualificationTypeId,
            Comparator="DoesNotExist",
            ActionsGuarded="DiscoverPreviewAndAccept",
        )

    def list_qualification_types(self) -> list[boto3_models.QualificationType]:
        qualification_types = []

        next_token = ""

        call_kwargs = {}
        while next_token is not None:
            if next_token != "":
                call_kwargs["NextToken"] = next_token
            else:
                if "NextToken" in call_kwargs:
                    del call_kwargs["NextToken"]

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

    def delete_worker_qualification_type(
        self,
        qualification_type_id: str,
    ) -> None:
        """Revoke a requester Qualification Type from Workers and delete it."""

        worker_ids = self.list_workers_with_qualification_type(
            qual_type_id=qualification_type_id,
        )
        for worker_id in worker_ids:
            self.boto3_client.disassociate_qualification_from_worker(
                WorkerId=worker_id,
                QualificationTypeId=qualification_type_id,
            )
        self.delete_qualification_type(qualification_type_id=qualification_type_id)


# %% Helpers
def package_external_question_xml(site_url: str, frame_height_px: int = 0) -> str:
    """Return MTurk ExternalQuestion XML for a participant-facing URL."""

    escaped_url = escape(site_url)
    return (
        '<ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/'
        'AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">'
        f"<ExternalURL>{escaped_url}</ExternalURL>"
        f"<FrameHeight>{frame_height_px}</FrameHeight>"
        "</ExternalQuestion>"
    )
