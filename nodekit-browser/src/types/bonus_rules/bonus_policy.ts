interface BaseBonusRule<T extends string, P>{
    bonus_rule_type: T;
    bonus_rule_parameters: P;
}
import type {SensorId, MonetaryAmountUsd} from "../common.ts";


interface ConstantBonusRuleParameters {
    sensor_id: SensorId
    bonus_amount_usd: MonetaryAmountUsd
}

export interface ConstantBonusRule extends BaseBonusRule<"ConstantBonusRule", ConstantBonusRuleParameters> {}

// Union of all bonus rule types:
export type BonusRule = ConstantBonusRule;