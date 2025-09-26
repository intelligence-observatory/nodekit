from abc import ABC
from typing import Literal, Union, Annotated

import pydantic

from nodekit._internal.types.common import (
    PressableKey,
    SpatialPoint
)


# %%
class BaseAction(pydantic.BaseModel, ABC):
    action_type: str


# %%
class ClickAction(BaseAction):
    action_type: Literal['ClickAction'] = 'ClickAction'
    x: SpatialPoint = pydantic.Field(description='The x-coordinate of the click, in Board units.')
    y: SpatialPoint = pydantic.Field(description='The y-coordinate of the click, in Board units.')


# %%
class WaitAction(BaseAction):
    action_type: Literal['TimeoutAction'] = 'TimeoutAction'


# %%
class KeyAction(BaseAction):
    action_type: Literal['KeyAction'] = 'KeyAction'
    key: PressableKey = pydantic.Field(description='The key that was pressed.')


# %%
Action = Annotated[
    Union[
        ClickAction,
        KeyAction,
        WaitAction,
    ],
    pydantic.Field(discriminator='action_type')
]
