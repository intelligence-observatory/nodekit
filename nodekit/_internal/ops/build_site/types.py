from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.trace import Trace


# %%
class BaseTraceSubmission(pydantic.BaseModel):
    platform: str = pydantic.Field(
        description="The name of the platform."
    )
    trace: Trace = pydantic.Field(
        description="The submitted Trace."
    )
    
# %% 
class MechanicalTurkTraceSubmission(BaseTraceSubmission):
    platform: Literal['MechanicalTurk']
    worker_id: str = pydantic.Field(
        description="The Mechanical Turk Worker ID."
    )
    hit_id: str = pydantic.Field(
        description="The Mechanical Turk HIT ID."
    )
    assignment_id: str = pydantic.Field(
        description="The Mechanical Turk Assignment ID."
    )

# %%
class ProlificTraceSubmission(BaseTraceSubmission):
    platform: Literal['Prolific']
    participant_id: str = pydantic.Field(
        description="The Prolific Participant ID."
    )
    study_id: str = pydantic.Field(
        description="The Prolific Study ID."
    )
    session_id: str = pydantic.Field(
        description="The Prolific Session ID."
    )

# %%
class OtherTraceSubmission(BaseTraceSubmission):
    platform: Literal['Other']

# %%
type TraceSubmission = Annotated[
    Union[
        MechanicalTurkTraceSubmission,
        ProlificTraceSubmission,
        OtherTraceSubmission,
    ],
    pydantic.Field(discriminator="platform")
]