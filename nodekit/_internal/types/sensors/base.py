from abc import ABC

import pydantic

from nodekit._internal.types.common import NodeTimePointMsec, SpatialPoint, SpatialSize


class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action and optionally applies an Outcome.
    """

    sensor_type: str


class TemporallyBoundedSensor(BaseSensor, ABC):
    """
    A Sensor that is only armed during a specific time window relative to the start of the Node.
    """

    start_msec: NodeTimePointMsec = pydantic.Field(
        default=0,
        description="The time (in milliseconds) relative to Node start when the Sensor is armed.",
    )
    end_msec: NodeTimePointMsec | None = pydantic.Field(
        default=None,
        description="The time (in milliseconds) relative to Node start when the Sensor automatically fires a timeout.",
    )


class VisualSensorMixin(pydantic.BaseModel):

    # Position:
    x: SpatialPoint = pydantic.Field(
        description="The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."
    )
    y: SpatialPoint = pydantic.Field(
        description="The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."
    )

    z_index: int | None = None

    # Shape:
    w: SpatialSize = pydantic.Field(
        description="The width of the Card, in Board units."
    )
    h: SpatialSize = pydantic.Field(
        description="The height of the Card, in Board units."
    )

# %%
class SensorValue(pydantic.BaseModel, ABC):
    ...