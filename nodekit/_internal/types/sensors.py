from abc import ABC
from typing import Literal, Annotated, Union, Self

import pydantic

from nodekit._internal.types.cards import Card
from nodekit._internal.types.values import Region, PressableKey, PixelSize, TimeDurationMsec


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Agent behavior.
    When a Sensor is triggered, it emits an Action.
    """

    sensor_type: str
    duration_msec: TimeDurationMsec | None = pydantic.Field(
        description="The number of milliseconds from the start of the Node when the Sensor resolves to a WaitAction. If None, the Sensor does not automatically resolve.",
        gt=0,
        default=None,
    )


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
class KeySensor(BaseSensor):
    sensor_type: Literal["KeySensor"] = "KeySensor"
    keys: list[PressableKey] = pydantic.Field(
        description="The keys that triggers the Sensor when pressed down.",
        min_length=1,
    )

    @pydantic.field_validator("keys", mode="after")
    def canonicalize_keys(cls, keys: list[PressableKey]) -> list[PressableKey]:
        unique_keys: set[PressableKey] = set(keys)
        return sorted(unique_keys)


# %%
class SelectSensor(BaseSensor):
    sensor_type: Literal["SelectSensor"] = "SelectSensor"
    choices: dict[str, Card]


# %%
class MultiSelectSensor(BaseSensor):
    sensor_type: Literal["MultiSelectSensor"] = "MultiSelectSensor"
    choices: dict[str, Card]

    min_selections: int = pydantic.Field(
        ge=0,
        description="The minimum number of Cards before the Sensor fires.",
    )

    max_selections: int | None = pydantic.Field(
        default=None,
        validate_default=False,
        ge=0,
        description="If None, the selection can contain up to the number of available Cards.",
    )

    confirm_button: Card

    @pydantic.model_validator(mode="after")
    def validate_selections_vals(self) -> Self:
        if self.max_selections is None:
            self.max_selections = len(self.choices)
        if self.max_selections < self.min_selections:
            raise ValueError(
                f"max_selections ({self.max_selections}) must be greater than min_selections ({self.min_selections})",
            )
        if self.max_selections > len(self.choices):
            raise ValueError(
                f"max_selections ({self.max_selections}) cannot be greater than the number of available choices ({len(self.choices)})",
            )

        return self


# %%
class TextEntrySensor(BaseSensor):
    sensor_type: Literal["TextEntrySensor"] = "TextEntrySensor"

    prompt: str = pydantic.Field(
        description="The initial placeholder text shown in the free text response box. It disappears when the user selects the element.",
        default="",
    )

    font_size: PixelSize = pydantic.Field(
        description="The height of the em-box, in Board units.",
        default=20,
        validate_default=True,
    )

    min_length: int = pydantic.Field(
        description="The minimum number of characters the user must enter before the Sensor fires.",
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
class SliderSensor(BaseSensor):
    sensor_type: Literal["SliderSensor"] = "SliderSensor"
    num_bins: int = pydantic.Field(gt=1)
    initial_bin_index: int
    show_bin_markers: bool = True
    orientation: Literal["horizontal", "vertical"] = "horizontal"
    region: Region

    confirm_button: Card | None = pydantic.Field(
        default=None,
        description="If provided, the agent must click this button to confirm their slider selection.",
    )


# %%
class ProductSensor(BaseSensor):
    sensor_type: Literal["ProductSensor"] = "ProductSensor"
    children: dict[str, "Sensor"]


# %%
class SumSensor(BaseSensor):
    sensor_type: Literal["SumSensor"] = "SumSensor"
    children: dict[str, "Sensor"]


# %%
type Sensor = Annotated[
    Union[
        WaitSensor,
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
