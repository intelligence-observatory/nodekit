import type {Transition} from "../types/transition.ts";
import type {NodeId, RegisterId, Value} from "../types/value.ts";
import type {Action} from "../types/actions";
import {evl} from "../interpreter/expression-interpreter.ts";


export interface EvalTransitionParams {
    transition: Readonly<Transition>,
    registers: Readonly<Record<RegisterId, Value>>,
    lastAction: Readonly<Action>
}

export interface EvalTransitionResult {
    nextNodeId: NodeId | null;
    registerUpdates: Record<RegisterId, Value>;
}

export function evalTransition(
    params: EvalTransitionParams
): EvalTransitionResult {
    const { transition, registers, lastAction } = params;
    switch (transition.transition_type) {
        case "Go": {
            // Evaluate register updates for a direct jump
            const registerUpdateValues: Record<RegisterId, Value> = {};
            for (const [registerId, updateExpression] of Object.entries(transition.register_updates)) {
                registerUpdateValues[registerId as RegisterId] = evl(
                    updateExpression,
                    {
                        graphRegisters: registers,
                        localVariables: {},
                        lastAction,
                    },
                );
            }
            return {
                nextNodeId: transition.to,
                registerUpdates: registerUpdateValues,
            };
        }
        case "Branch": {
            // Evaluate guarded cases in order; recurse into the matching branch
            for (const { when, then } of transition.cases) {
                const cond = evl(
                    when,
                    {
                        graphRegisters: registers,
                        localVariables: {},
                        lastAction,
                    },
                );
                if (cond) {
                    return evalTransition({
                        transition: then,
                        registers,
                        lastAction,
                    });
                }
            }
            return evalTransition({
                transition: transition.otherwise,
                registers,
                lastAction,
            });
        }
        case "End":
            return {
                nextNodeId: null,
                registerUpdates: {},
            };
        default:
            const _exhaustiveCheck: never = transition;
            throw new Error(`Unhandled transition: ${JSON.stringify(_exhaustiveCheck)}`);
    }
}
