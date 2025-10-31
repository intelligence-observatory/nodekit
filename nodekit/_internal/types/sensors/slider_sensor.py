from typing import Literal

import pydantic

from nodekit._internal.types.sensors.base import TemporallyBoundedSensor, VisualSensorMixin, SensorValue


# %%
class SliderSensor(TemporallyBoundedSensor, VisualSensorMixin):
    sensor_type: Literal["SliderSensor"] = "SliderSensor"

    num_bins: int = pydantic.Field(
        description="The number of discrete bins in the slider.", ge=2, default=7
    )

    initial_bin_index: int | None = pydantic.Field(
        description="The initial bin index that the slider is set to when it first appears. If None, defaults to the middle bin.",
        ge=0,
        default=None,
    )

    orientation: Literal["horizontal", "vertical"] = pydantic.Field(
        description="The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top.",
        default="horizontal",
    )

    show_bin_markers: bool = pydantic.Field(
        description="Whether to show the bin markers on the slider. This is best used for sliders with a small number of bins.",
        default=False,
    )


# %%
class SliderSensorValue(SensorValue):
    slider_normalized_position: float = pydantic.Field(
        description="The value of the slider, in normalized units.", ge=0, le=1
    )
    slider_bin_index: int = pydantic.Field(
        description="The index of the bin that was selected.", ge=0
    )
