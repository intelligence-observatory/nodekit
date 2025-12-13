from abc import ABC
from typing import Literal, Annotated, Union, Self, Dict

import pydantic

from nodekit._internal.types.values import Region
from nodekit._internal.types.cards import Card
from nodekit._internal.types.values import (
    PressableKey,
    SpatialSize,
    TimeDurationMsec,
)


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action and optionally applies an Outcome.
    """

    sensor_type: str


# %%
class WaitSensor(BaseSensor):
    """
    A Sensor that triggers when the specified time has elapsed since the start of the Node.
    """

    sensor_type: Literal["WaitSensor"] = "WaitSensor"
    duration_msec: TimeDurationMsec = pydantic.Field(
        description="The number of milliseconds from the start of the Node when the Sensor triggers.",
        gt=0,
    )


# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal["ClickSensor"] = "ClickSensor"
    region: Region


# %%
class KeySensor(BaseSensor):
    sensor_type: Literal["KeySensor"] = "KeySensor"
    keys: list[PressableKey] = pydantic.Field(
        description="The keys that triggers the Sensor when pressed down."
    )


# %%
class SelectSensor(BaseSensor):
    sensor_type: Literal["SelectSensor"] = "SelectSensor"
    choices: Dict[str, Card]


# %%
class MultiSelectSensor(BaseSensor):
    sensor_type: Literal["MultiSelectSensor"] = "MultiSelectSensor"
    choices: Dict[str, Card]

    min_selections: int = pydantic.Field(
        ge=0,
        description="The minimum number of Cards before the Sensor fires.",
    )

    max_selections: int | None = pydantic.Field(
        default=None,
        validate_default=True,
        ge=0,
        description="If None, the selection can contain up to the number of available Cards.",
    )

    confirm_button: Card

    @pydantic.model_validator(mode="after")
    def validate_selections_vals(self) -> Self:
        if (
            self.max_selections is not None
            and self.max_selections < self.min_selections
        ):
            raise pydantic.ValidationError(
                f"max_selections ({self.max_selections}) must be greater than min_selections ({self.min_selections})",
            )
        return self


# %%
class SliderSensor(BaseSensor):
    sensor_type: Literal["SliderSensor"] = "SliderSensor"
    num_bins: int = pydantic.Field(gt=1)
    initial_bin_index: int
    show_bin_markers: bool = True
    orientation: Literal["horizontal", "vertical"] = "horizontal"
    region: Region


# %%
class TextEntrySensor(BaseSensor):
    sensor_type: Literal["TextEntrySensor"] = "TextEntrySensor"

    prompt: str = pydantic.Field(
        description="The initial placeholder text shown in the free text response box. It disappears when the user selects the element.",
        default="",
    )

    font_size: SpatialSize = pydantic.Field(
        description="The height of the em-box, in Board units.",
        default=0.02,
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

    region: Region


# %%
class ProductSensor(BaseSensor):
    sensor_type: Literal["ProductSensor"] = "ProductSensor"
    children: Dict[str, "Sensor"]


# %%
class SumSensor(BaseSensor):
    sensor_type: Literal["SumSensor"] = "SumSensor"
    children: Dict[str, "Sensor"]


# %%
type Sensor = Annotated[
    Union[
        WaitSensor,
        ClickSensor,
        KeySensor,
        SelectSensor,
        MultiSelectSensor,
        SliderSensor,
        TextEntrySensor,
        ProductSensor,
        SumSensor,
    ],
    pydantic.Field(discriminator="sensor_type"),
]
