from decimal import Decimal
from typing import List

from nodekit._internal.models.node_engine.bonus_policy import BonusRule, ConstantBonusRule
from nodekit._internal.models.node_engine.node_graph import NodeResult


# %% BonusPolicy Rule Engine
def compute_bonus(
        bonus_rules: List[BonusRule],
        node_results: List[NodeResult]
) -> Decimal:

    calculated_amount = Decimal('0')

    for node_result in node_results:
        action = node_result.action

        # Perform scan through rules
        for rule in bonus_rules:
            # Dynamic dispatch
            if isinstance(rule, ConstantBonusRule):
                rule: ConstantBonusRule
                if action.sensor_id == rule.bonus_rule_parameters.sensor_id:
                    # Check currency match
                    calculated_amount += Decimal(rule.bonus_rule_parameters.bonus_amount_usd)

    # Clip at minimum of 0:
    if calculated_amount < Decimal('0'):
        calculated_amount = Decimal('0.00')

    return calculated_amount