from typing import Literal, Annotated, Union, Self
import re
import pydantic

from nodekit._internal.types.common import (
    PressableKey,
    NodeTimePointMsec,
    SpatialPoint,
    SpatialSize,
    Mask,
    CardId,
ColorHexString, MarkdownString
)
from nodekit._internal.types.sensors.base import BaseSensor, TemporallyBoundedSensor, VisualSensorMixin


# %%
class WaitSensor(BaseSensor):
    """
    A Sensor that triggers when the specified time has elapsed since the start of the Node.
    """

    sensor_type: Literal["WaitSensor"] = "WaitSensor"
    until_msec: NodeTimePointMsec = pydantic.Field(
        description="The number of milliseconds from the start of the Node when the Sensor triggers.",
        gt=0,
    )


# %%


# %%
class ClickSensor(TemporallyBoundedSensor):
    sensor_type: Literal["ClickSensor"] = "ClickSensor"
    x: SpatialPoint = pydantic.Field(
        description="The center of the bounding box of the clickable region, along the Board x-axis."
    )
    y: SpatialPoint = pydantic.Field(
        description="The center of the bounding box of the clickable region, along the Board y-axis."
    )
    w: SpatialSize = pydantic.Field(
        description="The width of the bounding box of the clickable region, in Board units.",
        gt=0,
    )
    h: SpatialSize = pydantic.Field(
        description="The height of the bounding box of the clickable region, in Board units.",
        gt=0,
    )
    mask: Mask = pydantic.Field(
        description='The shape of the clickable region. "rectangle" uses the box itself; "ellipse" inscribes an ellipse within the box.',
        default="rectangle",
        validate_default=True,
    )

# %%
class SelectSensor(TemporallyBoundedSensor):
    sensor_type: Literal["SelectSensor"] = "SelectSensor"
    choices: list[CardId]

    min_selections: int = pydantic.Field(
        default=1,
        validate_default=True,
        ge=0,
        description='The minimum number of Cards before the Sensor fires.',
    )

    max_selections: int | None = pydantic.Field(
        default=None,
        validate_default=True,
        ge=0,
        description='If None, the selection can contain up to the number of available Cards.'
    )

    hover_color: ColorHexString
    selected_color: ColorHexString

    @pydantic.model_validator(mode='after')
    def validate_selections_vals(self) -> Self:
        if self.max_selections is not None and self.max_selections < self.min_selections:
            raise pydantic.ValidationError(
                f'max_selections ({self.max_selections}) must be greater than min_selections ({self.min_selections})',
            )
        return self

# %%


# %%
class KeySensor(TemporallyBoundedSensor):
    sensor_type: Literal["KeySensor"] = "KeySensor"
    keys: list[PressableKey] = pydantic.Field(
        description="The keys that triggers the Sensor when pressed down."
    )

# %%
class FreeTextEntrySensor(TemporallyBoundedSensor, VisualSensorMixin):
    sensor_type: Literal["FreeTextEntrySensor"] = "FreeTextEntrySensor"

    prompt: str = pydantic.Field(
        description="The initial placeholder text shown in the free text response box. It disappears when the user selects the element.",
        default="",
    )

    font_size: SpatialSize = pydantic.Field(
        description="The height of the em-box, in Board units.",
        default=0.02,
    )

    text_color: ColorHexString = pydantic.Field(
        default="#000000", validate_default=True
    )
    background_color: ColorHexString = pydantic.Field(
        default="#ffffff",  # White by default
        validate_default=True,
        description="The background color of the entry field.",
    )

    min_length: int = pydantic.Field(
        description="The minimum number of characters the user must enter before the Sensor fires. If None, no limit.",
        default=1,
        ge=1,
        le=10000,
    )

    max_length: int | None = pydantic.Field(
        description="The maximum number of characters the user can enter. If None, no limit.",
        default=None,
        ge=1,
        le=10000,
    )

    pattern: re.Pattern | None = None



# %%
class SubmitSensor(TemporallyBoundedSensor, VisualSensorMixin):
    """
    A special Sensor which toggles between a locked and ready state, based on all other non-SubmitSensor sensors.
    When ready, it may be pressed by the agent, which causes it to enter into submittable state.

    If any other non-SubmitSensor exits submittable status, the SubmitSensor goes into locked state.
    """

    sensor_type: Literal["SubmitSensor"] = "SubmitSensor"

    locked_text: MarkdownString = '...'
    locked_color: ColorHexString

    ready_text: MarkdownString = 'Submit'
    ready_color: ColorHexString

# %%
Sensor = Annotated[
    Union[
        WaitSensor,
        ClickSensor,
        KeySensor,
        SubmitSensor,
    ],
    pydantic.Field(discriminator="sensor_type"),
]
