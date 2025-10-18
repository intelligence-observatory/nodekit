from abc import ABC, abstractmethod
from decimal import Decimal
from typing import List, Iterable, Literal

import pydantic

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
