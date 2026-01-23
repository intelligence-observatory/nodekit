from functools import cached_property
from typing import Annotated, Literal, Union

import base64
import binascii
import gzip

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
    turk_submit_to: str = pydantic.Field(
        description="The link that the Trace was submitted to. Encodes whether sandbox or production."
    )


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
    trace_gzipped_base64: str = pydantic.Field(
        description="The submitted Trace as base64-encoded gzipped JSON bytes."
    )
    platform_context: PlatformContext = pydantic.Field(
        description="Information about the platform (if any) that the Graph site was hosted on."
    )

    @cached_property
    def trace(self) -> Trace:
        """
        Decompresses and decodes the gzipped base64 Trace.

        Returns:
            Decompressed Trace object.

        """
        try:
            decoded = base64.b64decode(self.trace_gzipped_base64, validate=True)
        except binascii.Error as exc:
            message = "trace_gzipped_base64 must be base64-encoded gzip JSON."
            raise ValueError(message) from exc

        try:
            json_bytes = gzip.decompress(decoded)
        except (OSError, EOFError) as exc:
            message = "trace_gzipped_base64 must be base64-encoded gzip JSON."
            raise ValueError(message) from exc

        return Trace.model_validate_json(json_bytes)
