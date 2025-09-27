from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import (
    PressableKey,
    NodeTimePointMsec,
    SpatialPoint,
    SpatialSize,
    Mask,
)


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action and optionally applies an Outcome.
    """

    sensor_type: str

# %%
class TimeoutSensor(BaseSensor):
    """
    A Sensor that triggers when the specified time has elapsed since the start of the Node.
    """
    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'
    timeout_msec: NodeTimePointMsec = pydantic.Field(
        description='The number of milliseconds from the start of the Node when the Sensor triggers.',
        gt=0,
    )

# %%
class TemporallyBoundedSensor(BaseSensor, ABC):
    """
    A Sensor that is only armed during a specific time window relative to the start of the Node.
    """
    start_msec: NodeTimePointMsec = pydantic.Field(
        default=0,
        description='The time (in milliseconds) relative to Node start when the Sensor is armed.',
    )
    end_msec: NodeTimePointMsec | None = pydantic.Field(
        default=None,
        description='The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends.',
    )

# %%
class ClickSensor(TemporallyBoundedSensor):
    sensor_type: Literal['ClickSensor'] = 'ClickSensor'
    x: SpatialPoint = pydantic.Field(description='The center of the bounding box of the clickable region, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the bounding box of the clickable region, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The width of the bounding box of the clickable region, in Board units.', gt=0)
    h: SpatialSize = pydantic.Field(description='The height of the bounding box of the clickable region, in Board units.', gt=0)
    mask: Mask = pydantic.Field(
        description='The shape of the clickable region. "rectangle" uses the box itself; "ellipse" inscribes an ellipse within the box.',
        default='rectangle',
        validate_default=True,
    )

# %%
class KeySensor(TemporallyBoundedSensor):
    sensor_type: Literal['KeySensor'] = 'KeySensor'
    key: PressableKey = pydantic.Field(description='The key that triggers the Sensor when pressed down.')


# %%
Sensor = Annotated[
    Union[
        TimeoutSensor,
        ClickSensor,
        KeySensor,
    ],
    pydantic.Field(discriminator='sensor_type')
]
