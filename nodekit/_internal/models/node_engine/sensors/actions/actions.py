from typing import Literal, Union, Annotated

import pydantic

from nodekit._internal.models.node_engine.base import DslModel, NullValue
from nodekit._internal.models.node_engine.sensors.actions.base import BaseAction
from nodekit._internal.models.fields import (
    DatetimeUTC
)
# %%

class ClickAction(BaseAction):
    """
    A fully-qualified description of a Sensor emission.
    """

    class Value(DslModel):
        """
        A fully-qualified description of a Sensor emission.
        """
        click_x: float = pydantic.Field(description='The x-coordinate of the click, in Board units.')
        click_y: float = pydantic.Field(description='The y-coordinate of the click, in Board units.')

    action_type: Literal['ClickAction'] = 'ClickAction'
    action_value: Value


# %%
class DoneAction(BaseAction):
    action_type: Literal['DoneAction'] = 'DoneAction'
    action_value: NullValue = pydantic.Field(default_factory=NullValue, frozen=True)


# %%
class TimeoutAction(BaseAction):
    action_type: Literal['TimeoutAction'] = 'TimeoutAction'
    action_value: NullValue = pydantic.Field(default_factory=NullValue, frozen=True)


# %%
Action = Annotated[
    Union[
        ClickAction,
        DoneAction,
        TimeoutAction,
        # Add other Action types here as needed
    ],
    pydantic.Field(discriminator='action_type')
]
