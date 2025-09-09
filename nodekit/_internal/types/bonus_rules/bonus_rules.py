from abc import ABC
from typing import Annotated, Union, Literal

import pydantic

from nodekit._internal.types.common import (
    MonetaryAmountUsd, SensorId, NodeId
)


# %%
class BaseBonusRule(pydantic.BaseModel, ABC):
    bonus_rule_type: str


class SensorTriggeredBonusRule(BaseBonusRule):
    """
    A bonus rule that applies a bonus whenever a particular Sensor in a particular Node is triggered (regardless of the Action's value).
    """
    bonus_rule_type: Literal['SensorTriggeredBonusRule'] = 'SensorTriggeredBonusRule'

    node_id: NodeId = pydantic.Field(
        description='The ID of the Node to which this bonus rule applies.'
    )
    sensor_id: SensorId = pydantic.Field(
        description='The ID of the Sensor to which this bonus rule applies.'
    )
    bonus_amount_usd: MonetaryAmountUsd = pydantic.Field(
        description='The change in bonus amount to apply when the sensor is triggered. Can be positive or negative.'
    )


# %%
BonusRule = Annotated[
    Union[SensorTriggeredBonusRule],
    pydantic.Field(
        discriminator='bonus_rule_type',
        description='The type of bonus rule to apply.'
    )
]