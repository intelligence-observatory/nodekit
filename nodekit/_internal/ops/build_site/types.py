from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.trace import Trace

# %%
class BasePlatformContext(pydantic.BaseModel):
    platform: str


# %%
class MechanicalTurkContext(BasePlatformContext):
    platform: Literal["MechanicalTurk"]
    assignment_id: str = pydantic.Field(description="The Mechanical Turk Assignment ID.")
    worker_id: str = pydantic.Field(description="The Mechanical Turk Worker ID.")
    hit_id: str = pydantic.Field(description="The Mechanical Turk HIT ID.")
    turk_submit_to: str = pydantic.Field(description="The link that the Trace was submitted to. Encodes whether sandbox or production.")



# %%
class ProlificContext(BasePlatformContext):
    platform: Literal["Prolific"]
    completion_code: str = pydantic.Field(description="The Prolific Completion Code.")
    prolific_pid: str = pydantic.Field(description="The Prolific Participant ID.")
    study_id: str = pydantic.Field(description="The Prolific Study ID.")
    session_id: str = pydantic.Field(description="The Prolific Session ID.")


# %%
class NoPlatformContext(BasePlatformContext):
    platform: Literal["None"]


# %%
type PlatformContext = Annotated[
    Union[
        MechanicalTurkContext,
        ProlificContext,
        NoPlatformContext,
    ],
    pydantic.Field(discriminator="platform"),
]



# %%
class SiteSubmission(pydantic.BaseModel):
    trace: Trace = pydantic.Field(description="The submitted Trace.")
    platform_context: PlatformContext = pydantic.Field(description="Information about the platform (if any) that the Graph site was hosted on.")


