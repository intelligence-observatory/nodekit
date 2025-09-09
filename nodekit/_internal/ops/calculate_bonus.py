from decimal import Decimal
from typing import List

from nodekit._internal.types.bonus_rules import BonusRule, ConstantBonusRule
from nodekit._internal.types.events.events import Event, EventTypeEnum


# %% BonusPolicy Rule Engine
def calculate_bonus_usd(
        events: List[Event],
        bonus_rules: List[BonusRule],
) -> Decimal:

    calculated_amount = Decimal('0')

    for ev in events:

        if ev.event_type != EventTypeEnum.NodeResultEvent:
            continue

        action = ev.event_payload.action

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