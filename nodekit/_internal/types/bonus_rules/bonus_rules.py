from abc import ABC
from typing import Annotated, Union, List, Literal

import pydantic

from nodekit._internal.types.common import (
    MonetaryAmountUsd, SensorId, NullParameters, NodeId
)


# %%
class BaseBonusRule(pydantic.BaseModel, ABC):
    bonus_rule_type: str
    bonus_rule_parameters: NullParameters


class ConstantBonusRule(BaseBonusRule):
    """
    A bonus rule that applies a bonus whenever a particular Sensor in a particular Node is triggered, regardless of the Action's value,
    and whether the Node has been visited already.
    """

    class Parameters(pydantic.BaseModel):
        """
        Parameters for the ConstantBonusRule.
        """
        node_id: NodeId = pydantic.Field(
            description='The ID of the node to which this bonus rule applies.'
        )
        sensor_id: SensorId = pydantic.Field(
            description='The ID of the sensor to which this bonus rule applies.'
        )
        bonus_amount_usd: MonetaryAmountUsd = pydantic.Field(
            description='The change in bonus amount to apply when the sensor is triggered. Can be positive or negative.'
        )

    bonus_rule_type: Literal['ConstantBonusRule'] = 'ConstantBonusRule'
    bonus_rule_parameters: Parameters


# %%
BonusRule = Annotated[
    Union[ConstantBonusRule],
    pydantic.Field(
        discriminator='bonus_rule_type',
        description='The type of bonus rule to apply.'
    )
]