from abc import ABC
from typing import Dict, Any, Annotated, Union, List, Literal

import pydantic

from nodekit._internal.models.node_engine.fields import SensorId
from nodekit._internal.models.fields import (
    MonetaryAmountUsd,
)


# %%
class BaseBonusRule(pydantic.BaseModel, ABC):
    bonus_rule_type: str
    bonus_rule_parameters: Dict[str, Any]


class ConstantBonusRule(BaseBonusRule):
    """
    A bonus rule that applies a bonus whenever a particular Sensor is triggered, regardless of the Action's value.
    """
    bonus_rule_type: Literal['ConstantBonusRule'] = 'ConstantBonusRule'

    class Parameters(pydantic.BaseModel):
        """
        Parameters for the ConstantBonusRule.
        """
        sensor_id: SensorId = pydantic.Field(
            description='The ID of the sensor to which this bonus rule applies.'
        )
        bonus_amount_usd: MonetaryAmountUsd = pydantic.Field(
            description='The change in bonus amount to apply when the sensor is triggered. Can be positive or negative.'
        )

    bonus_rule_parameters: Parameters


# %%
BonusRule = Annotated[
    Union[ConstantBonusRule],
    pydantic.Field(
        discriminator='bonus_rule_type',
        description='The type of bonus rule to apply.'
    )
]


# %%
class BonusPolicy(pydantic.BaseModel):
    bonus_rules: List[BonusRule] = pydantic.Field(default_factory=list)
