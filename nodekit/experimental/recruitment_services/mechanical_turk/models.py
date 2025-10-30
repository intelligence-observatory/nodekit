import datetime
from decimal import Decimal
from typing import List, Optional, Literal

import pydantic


# %%
class HIT(pydantic.BaseModel):
    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/mturk/client/create_hit.html
    HITId: str
    HITTypeId: Optional[str]
    HITGroupId: Optional[str] = None
    CreationTime: datetime.datetime
    Title: str
    Description: str
    Question: str
    Keywords: str
    HITStatus: Literal[
        "Assignable", "Unassignable", "Reviewable", "Reviewing", "Disposed"
    ]
    MaxAssignments: int
    Reward: Decimal = pydantic.Field(decimal_places=2)
    AutoApprovalDelayInSeconds: int
    Expiration: datetime.datetime
    AssignmentDurationInSeconds: int
    RequesterAnnotation: Optional[str] = None
    QualificationRequirements: Optional[List["QualificationRequirement"]] = None
    HITReviewStatus: Literal[
        "NotReviewed", "MarkedForReview", "ReviewedAppropriate", "ReviewedInappropriate"
    ]
    NumberOfAssignmentsPending: int
    NumberOfAssignmentsAvailable: int
    NumberOfAssignmentsCompleted: int


class Assignment(pydantic.BaseModel):
    # https://boto3.amazonaws.com/v1/documentation/api/1.26.93/reference/services/mturk/client/list_assignments_for_hit.html
    AssignmentId: str
    WorkerId: str
    HITId: str
    AssignmentStatus: Literal["Submitted", "Approved", "Rejected"]
    AutoApprovalTime: Optional[datetime.datetime] = None
    AcceptTime: Optional[datetime.datetime] = None
    SubmitTime: Optional[datetime.datetime] = None
    ApprovalTime: Optional[datetime.datetime] = None
    RejectionTime: Optional[datetime.datetime] = None
    Deadline: Optional[datetime.datetime] = None
    Answer: str
    RequesterFeedback: Optional[str] = None


class BonusPayment(pydantic.BaseModel):
    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/mturk/client/list_bonus_payments.html
    WorkerId: str
    AssignmentId: str
    BonusAmount: Decimal = pydantic.Field(decimal_places=2)
    Reason: Optional[str] = None
    GrantTime: Optional[datetime.datetime] = None


# %% Qualifications
class QualificationType(pydantic.BaseModel):
    # https://docs.aws.amazon.com/AWSMechTurk/latest/AWSMturkAPI/ApiReference_QualificationTypeDataStructureArticle.html
    QualificationTypeId: str
    CreationTime: Optional[datetime.datetime] = None
    Name: Optional[str] = None
    Description: Optional[str] = None
    Keywords: Optional[str] = None
    QualificationTypeStatus: Literal["Active", "Inactive"]
    RetryDelayInSeconds: Optional[int] = None
    Test: Optional[str] = None
    TestDurationInSeconds: Optional[int] = None
    AnswerKey: Optional[str] = None
    AutoGranted: Optional[bool] = None
    AutoGrantedValue: Optional[int] = 1
    IsRequestable: Optional[bool] = None


class QualificationRequirement(pydantic.BaseModel):
    QualificationTypeId: str

    Comparator: Literal[
        "LessThan",
        "LessThanOrEqualTo",
        "GreaterThan",
        "GreaterThanOrEqualTo",
        "EqualTo",
        "NotEqualTo",
        "Exists",
        "DoesNotExist",
        "In",
        "NotIn",
    ]
    ActionsGuarded: Literal["Accept", "PreviewAndAccept", "DiscoverPreviewAndAccept"]
    IntegerValues: Optional[List[int]] = pydantic.Field(default=None)
    LocaleValues: Optional[List["LocaleValue"]] = pydantic.Field(default=None)

    @pydantic.model_serializer()
    def ensure_exclude_none(self):
        # boto3 expects IntegerValues and LocaleValues to not be present as fields if they are None:
        base = dict(
            QualificationTypeId=self.QualificationTypeId,
            Comparator=self.Comparator,
            ActionsGuarded=self.ActionsGuarded,
        )
        if self.IntegerValues is not None:
            base["IntegerValues"] = self.IntegerValues
        if self.LocaleValues is not None:
            base["LocaleValues"] = self.LocaleValues
        return base


class LocaleValue(pydantic.BaseModel):
    Country: str
    Subdivision: Optional[str]
