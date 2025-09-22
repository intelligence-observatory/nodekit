from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import PressableKey, NodeTimePointMsec
from nodekit._internal.types.outcome import Outcome
from nodekit._internal.types.common import SpatialPoint, SpatialSize, Mask


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action and optionally applies an Outcome.

    """

    # Sensor identifiers
    sensor_type: str

    start_msec: NodeTimePointMsec = pydantic.Field(
        default=0,
        description='The time (in milliseconds) relative to Node start when the Sensor is armed.',
    )

    end_msec: NodeTimePointMsec | None = pydantic.Field(
        default=None,
        description='The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends.',
    )
    outcome: Outcome | None = pydantic.Field(
        default=None,
        description='The Outcome that will occur if this Sensor is triggered. If None, no Outcome occurs.',
    )

# %%
class TimeoutSensor(BaseSensor):
    """
    A Sensor that triggers immediately when armed.
    """
    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'
    start_msec: NodeTimePointMsec
    end_msec: None = pydantic.Field(default=None)

# %%
class ClickSensor(BaseSensor):
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
class KeySensor(BaseSensor):
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
