import datetime
from decimal import Decimal

import pytest

import nodekit.experimental.turk.models as turk_models
from nodekit.experimental.turk.client import (
    CreateHitRequest,
    MAX_AUTO_APPROVAL_DELAY_SEC,
    MturkClient,
    package_external_question_xml,
)


# %% Fakes
class FakeBoto3MturkClient:
    def __init__(self):
        self.create_hit_type_kwargs = {}
        self.create_hit_with_hit_type_kwargs = {}
        self.created_qualification_types = []
        self.associated_qualifications = []
        self.disassociated_qualifications = []
        self.deleted_qualification_type_ids = []
        self.expired_hit_ids = []
        self.list_hits_calls = []
        self.list_bonus_payments_calls = []

    def get_account_balance(self):
        return {"AvailableBalance": "100.00"}

    def create_hit_type(self, **kwargs):
        self.create_hit_type_kwargs = kwargs
        return {"HITTypeId": "hit-type-1"}

    def create_hit_with_hit_type(self, **kwargs):
        self.create_hit_with_hit_type_kwargs = kwargs
        return {
            "HIT": _hit_response(
                hit_id="hit-1",
                hit_type_id=kwargs["HITTypeId"],
                question=kwargs["Question"],
                hit_type_kwargs=self.create_hit_type_kwargs,
                max_assignments=kwargs["MaxAssignments"],
            )
        }

    def get_hit(self, HITId):
        return {
            "HIT": _hit_response(
                hit_id=HITId,
                hit_type_id="hit-type-1",
                question="<ExternalQuestion />",
                hit_type_kwargs={
                    "Title": "Title",
                    "Description": "Description",
                    "Keywords": "nodekit",
                    "Reward": "1.00",
                    "AutoApprovalDelayInSeconds": MAX_AUTO_APPROVAL_DELAY_SEC,
                    "AssignmentDurationInSeconds": 60,
                    "QualificationRequirements": [
                        {
                            "QualificationTypeId": "qual-1",
                            "Comparator": "Exists",
                            "ActionsGuarded": "DiscoverPreviewAndAccept",
                        }
                    ],
                },
                max_assignments=1,
            )
        }

    def list_hits(self, **kwargs):
        self.list_hits_calls.append(kwargs)
        if "NextToken" not in kwargs:
            return {
                "NumResults": 1,
                "NextToken": "page-2",
                "HITs": [
                    _hit_response(
                        hit_id="hit-1",
                        hit_type_id="hit-type-1",
                        question="<ExternalQuestion />",
                        hit_type_kwargs={
                            "Title": "First",
                            "Description": "Description",
                            "Keywords": "nodekit",
                            "Reward": "1.00",
                            "AutoApprovalDelayInSeconds": MAX_AUTO_APPROVAL_DELAY_SEC,
                            "AssignmentDurationInSeconds": 60,
                            "QualificationRequirements": [],
                        },
                        max_assignments=1,
                    )
                ],
            }
        return {
            "NumResults": 1,
            "HITs": [
                _hit_response(
                    hit_id="hit-2",
                    hit_type_id="hit-type-1",
                    question="<ExternalQuestion />",
                    hit_type_kwargs={
                        "Title": "Second",
                        "Description": "Description",
                        "Keywords": "nodekit",
                        "Reward": "1.00",
                        "AutoApprovalDelayInSeconds": MAX_AUTO_APPROVAL_DELAY_SEC,
                        "AssignmentDurationInSeconds": 60,
                        "QualificationRequirements": [],
                    },
                    max_assignments=1,
                )
            ],
        }

    def update_expiration_for_hit(self, HITId, ExpireAt):
        self.expired_hit_ids.append(HITId)
        assert ExpireAt.tzinfo is not None

    def create_qualification_type(self, **kwargs):
        qualification_type_id = f"qual-{len(self.created_qualification_types) + 1}"
        self.created_qualification_types.append(kwargs)
        return {
            "QualificationType": {
                "QualificationTypeId": qualification_type_id,
                "Name": kwargs["Name"],
                "Description": kwargs["Description"],
                "QualificationTypeStatus": kwargs["QualificationTypeStatus"],
            }
        }

    def associate_qualification_with_worker(self, **kwargs):
        self.associated_qualifications.append(kwargs)

    def list_bonus_payments(self, **kwargs):
        self.list_bonus_payments_calls.append(kwargs)
        if "NextToken" not in kwargs:
            return {
                "NumResults": 1,
                "NextToken": "page-2",
                "BonusPayments": [
                    {
                        "WorkerId": "worker-1",
                        "AssignmentId": "assignment-1",
                        "BonusAmount": "1.25",
                        "Reason": "First bonus.",
                        "GrantTime": datetime.datetime.now(tz=datetime.timezone.utc),
                    }
                ],
            }
        return {
            "NumResults": 1,
            "BonusPayments": [
                {
                    "WorkerId": "worker-2",
                    "AssignmentId": "assignment-2",
                    "BonusAmount": "2.50",
                    "Reason": "Second bonus.",
                    "GrantTime": datetime.datetime.now(tz=datetime.timezone.utc),
                }
            ],
        }

    def list_workers_with_qualification_type(self, **kwargs):
        assert kwargs["QualificationTypeId"] == "qual-1"
        return {"Qualifications": [{"WorkerId": "worker-1"}, {"WorkerId": "worker-2"}]}

    def disassociate_qualification_from_worker(self, **kwargs):
        self.disassociated_qualifications.append(kwargs)

    def delete_qualification_type(self, QualificationTypeId):
        self.deleted_qualification_type_ids.append(QualificationTypeId)


def _hit_response(
    *,
    hit_id: str,
    hit_type_id: str,
    question: str,
    hit_type_kwargs: dict,
    max_assignments: int,
) -> dict:
    now = datetime.datetime.now(tz=datetime.timezone.utc)
    return {
        "HITId": hit_id,
        "HITTypeId": hit_type_id,
        "HITGroupId": None,
        "CreationTime": now,
        "Title": hit_type_kwargs["Title"],
        "Description": hit_type_kwargs["Description"],
        "Question": question,
        "Keywords": hit_type_kwargs["Keywords"],
        "HITStatus": "Assignable",
        "MaxAssignments": max_assignments,
        "Reward": hit_type_kwargs["Reward"],
        "AutoApprovalDelayInSeconds": hit_type_kwargs["AutoApprovalDelayInSeconds"],
        "Expiration": now,
        "AssignmentDurationInSeconds": hit_type_kwargs["AssignmentDurationInSeconds"],
        "RequesterAnnotation": "token-1",
        "QualificationRequirements": hit_type_kwargs["QualificationRequirements"],
        "HITReviewStatus": "NotReviewed",
        "NumberOfAssignmentsPending": 0,
        "NumberOfAssignmentsAvailable": max_assignments,
        "NumberOfAssignmentsCompleted": 0,
    }


# %% Tests
def test_package_external_question_xml_escapes_site_url() -> None:
    xml = package_external_question_xml(
        site_url="https://nodekit.example/s/site-1?batch=a&nodekitSubmitTo=https://server/submit",
        frame_height_px=650,
    )

    assert "batch=a&amp;nodekitSubmitTo=" in xml
    assert "<FrameHeight>650</FrameHeight>" in xml


def test_create_hit_passes_low_level_request_to_boto3() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)
    qualification_requirement = turk_models.QualificationRequirement(
        QualificationTypeId="qual-1",
        Comparator="Exists",
        ActionsGuarded="DiscoverPreviewAndAccept",
    )

    hit = client.create_hit(
        CreateHitRequest(
            site_url="https://nodekit.example/s/site-1?x=1&y=2",
            title="Title",
            description="Description",
            keywords=["nodekit", "task"],
            num_assignments=2,
            duration_sec=600,
            completion_reward_usd=Decimal("1.25"),
            qualification_requirements=(qualification_requirement,),
            unique_request_token="token-1",
            auto_approval_delay_sec=3600,
            lifetime_sec=7200,
        )
    )

    assert hit.HITId == "hit-1"
    assert fake_boto3_client.create_hit_type_kwargs["AutoApprovalDelayInSeconds"] == 3600
    assert fake_boto3_client.create_hit_type_kwargs["AssignmentDurationInSeconds"] == 600
    assert fake_boto3_client.create_hit_type_kwargs["QualificationRequirements"] == [
        {
            "QualificationTypeId": "qual-1",
            "Comparator": "Exists",
            "ActionsGuarded": "DiscoverPreviewAndAccept",
        }
    ]
    assert fake_boto3_client.create_hit_with_hit_type_kwargs["LifetimeInSeconds"] == 7200
    assert "x=1&amp;y=2" in fake_boto3_client.create_hit_with_hit_type_kwargs["Question"]


def test_iter_hits_paginates_boto3_list_hits() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    hits = list(client.iter_hits())

    assert [hit.HITId for hit in hits] == ["hit-1", "hit-2"]
    assert [hit.Title for hit in hits] == ["First", "Second"]
    assert fake_boto3_client.list_hits_calls == [
        {"MaxResults": 100},
        {"MaxResults": 100, "NextToken": "page-2"},
    ]


def test_iter_bonus_payments_paginates_by_hit_id() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    bonus_payments = list(client.iter_bonus_payments(hit_id="hit-1"))

    assert [bonus.WorkerId for bonus in bonus_payments] == ["worker-1", "worker-2"]
    assert [bonus.BonusAmount for bonus in bonus_payments] == [
        Decimal("1.25"),
        Decimal("2.50"),
    ]
    assert fake_boto3_client.list_bonus_payments_calls == [
        {"MaxResults": 100, "HITId": "hit-1"},
        {"MaxResults": 100, "HITId": "hit-1", "NextToken": "page-2"},
    ]


def test_iter_bonus_payments_requires_exactly_one_filter() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    with pytest.raises(ValueError, match="exactly one"):
        list(client.iter_bonus_payments())

    with pytest.raises(ValueError, match="exactly one"):
        list(client.iter_bonus_payments(hit_id="hit-1", assignment_id="assignment-1"))


def test_grant_qualification_associates_worker() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    qual_type = client.create_qualification_type(
        unique_name="nodekit:site:site-1:eligible",
        description="Eligible workers for Site site-1.",
    )
    client.grant_qualification(
        qualification_type_id=qual_type.QualificationTypeId,
        worker_id="worker-1",
        integer_value=7,
    )

    assert qual_type.QualificationTypeId == "qual-1"
    assert fake_boto3_client.created_qualification_types == [
        {
            "Name": "nodekit:site:site-1:eligible",
            "Description": "Eligible workers for Site site-1.",
            "QualificationTypeStatus": "Active",
        }
    ]
    assert fake_boto3_client.associated_qualifications == [
        {
            "QualificationTypeId": "qual-1",
            "WorkerId": "worker-1",
            "IntegerValue": 7,
            "SendNotification": False,
        }
    ]


def test_package_qualification_does_not_exist_requirement() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    qual_type = client.create_qualification_type(
        unique_name="nodekit:site:site-1:blocked",
        description="Blocked workers for Site site-1.",
    )
    requirement = client.package_qualification_does_not_exist_requirement(qual_type=qual_type)

    assert qual_type.QualificationTypeId == "qual-1"
    assert fake_boto3_client.created_qualification_types == [
        {
            "Name": "nodekit:site:site-1:blocked",
            "Description": "Blocked workers for Site site-1.",
            "QualificationTypeStatus": "Active",
        }
    ]
    assert requirement.model_dump(mode="json") == {
        "QualificationTypeId": "qual-1",
        "Comparator": "DoesNotExist",
        "ActionsGuarded": "DiscoverPreviewAndAccept",
    }


def test_cleanup_hit_expires_hit_without_deleting_qualifications() -> None:
    fake_boto3_client = FakeBoto3MturkClient()
    client = MturkClient(boto3_client=fake_boto3_client, verify_credentials=False)

    client.cleanup_hit(hit_id="hit-1")

    assert fake_boto3_client.expired_hit_ids == ["hit-1"]
    assert fake_boto3_client.deleted_qualification_type_ids == []
    assert fake_boto3_client.disassociated_qualifications == []
