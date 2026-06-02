from datetime import datetime
from enum import Enum
from uuid import UUID

import pydantic
from pydantic import Field

from nodekit.values import MediaType, SHA256


# %%
class RecruiterEnum(str, Enum):
    PROLIFIC = "prolific"
    MTURK = "mturk"
    MTURK_SANDBOX = "mturk_sandbox"
    TESTING = "testing"  # links meant to be sent directly to participants; participants optionally disclose their own identity in a flow


class RunStatusEnum(str, Enum):
    STARTED = "started"
    SUBMITTED = "submitted"


class SiteStatusEnum(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


# %%
type UserId = UUID
type TagId = UUID
type SiteId = UUID
type RunId = UUID
type ConditionId = str


# %%
class _Base(pydantic.BaseModel):
    timestamp_created: datetime


# %%
class SiteRecord(_Base):
    site_id: SiteId  # used to feed the URL participants open
    owner_id: UserId
    name: str | None  # user-supplied name for the launch, not necessarily unique
    status: SiteStatusEnum


class SiteTagRecord(_Base):
    site_id: UUID
    tag_id: UUID


class TagRecord(_Base):
    tag_id: UUID
    value: str


# %%
class SiteConditionRecord(_Base):
    site_id: SiteId
    condition_id: ConditionId
    allocation_weight: int = Field(
        default=1,
        gt=0,
        description=(
            "Relative weight for balancing participant assignment across Conditions. "
            "This is not a quota or capacity."
        ),
    )
    graph_json_gzip: bytes


# %%
class RunRecord(_Base):
    site_id: SiteId
    condition_id: ConditionId
    run_id: RunId
    run_status: RunStatusEnum
    site_submission_json_gzip: bytes | None

    # Inferred from site submission / context; nodekit-server does not interpret these fields, but they may be useful for joins and debugging
    recruiter: RecruiterEnum
    recruiter_launch_handle_id: str  # e.g. inferred HIT ID
    recruiter_run_handle_id: str  # e.g. inferred Assignment ID
    recruiter_participant_id: str  # e.g. inferred Worker ID


# %%
class AssetRecord(_Base):
    sha256: SHA256
    media_type: MediaType
    size_bytes: int = Field(ge=0)
    storage_key: str = Field(
        min_length=1,
        description="Storage-provider key for the Asset bytes, such as an S3 key or file path.",
    )


class AssetDependencyRecord(_Base):
    site_id: SiteId
    condition_id: ConditionId
    sha256: SHA256
    media_type: MediaType
