import type {Event, NodeResult} from "./events.ts";
import type {BonusRule} from "./types/bonus_rules/bonus_policy.ts";
import type {Action} from "./types/sensors/actions/actions.ts";

export function computeBonusUsd(
    events: Event[],
    bonusRules: BonusRule[],
): number {
    /*
    Function which implements the client-side bonus rule engine.
     */

    let bonusComputed = 0;
    for (let i = 0; i < events.length; i++) {

        const eventCur = events[i];
        // Type narrow to NodeResultEvent:
        if (eventCur.event_type !== 'NodeResultEvent') {
            continue;
        }
        const nodeResult: NodeResult = eventCur.event_payload;
        const action: Action = nodeResult.action;

        // Run bonus rule engine on this NodeResult:
        for (let ruleIndex = 0; ruleIndex < bonusRules.length; ruleIndex++) {
            const rule = bonusRules[ruleIndex];
            // Dynamic dispatch:
            if (rule.bonus_rule_type === 'ConstantBonusRule') {
                const parameters = rule.bonus_rule_parameters;
                if (parameters.sensor_id === action.sensor_id) {
                    bonusComputed += Number(parameters.bonus_amount_usd);
                }
            }
        }
    }
    bonusComputed = Math.max(0, bonusComputed);
    bonusComputed = Math.round(bonusComputed * 100) / 100; // Round to 2 decimals

    // Convert to string:
    return bonusComputed;
}