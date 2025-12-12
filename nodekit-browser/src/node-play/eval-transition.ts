import type {Transition} from "../types/transition.ts";
import type {NodeId, RegisterId, Value} from "../types/value.ts";
import type {Action} from "../types/actions";
import {evl} from "../interpreter/expression-interpreter.ts";


export interface EvalTransitionParams {
    transition: Readonly<Transition>,
    registers: Readonly<Record<RegisterId, Value>>,
    lastSubgraphRegisters: Readonly<Record<RegisterId, Value>> | null,
    lastAction: Readonly<Action> | null
}

export interface EvalTransitionResult {
    nextNodeId: NodeId | null;
    registerUpdates: Record<RegisterId, Value>;
}

export function evalTransition(
    params: EvalTransitionParams
): EvalTransitionResult {
    const { transition, registers, lastAction, lastSubgraphRegisters } = params;
    switch (transition.transition_type) {

        case "Go":
        case "End": {
            // Evaluate register updates for a direct jump
            const registerUpdateValues: Record<RegisterId, Value> = {};
            for (const [registerId, updateExpression] of Object.entries(transition.register_updates)) {
                registerUpdateValues[registerId as RegisterId] = evl(
                    updateExpression,
                    {
                        graphRegisters: registers,
                        localVariables: {},
                        lastAction:lastAction,
                        lastSubgraphRegisters: lastSubgraphRegisters,
                    },
                );
            }
            if (transition.transition_type === "Go") {
                return {
                    nextNodeId: transition.to,
                    registerUpdates: registerUpdateValues,
                };
            }
            else if (transition.transition_type === "End") {
                return {
                    nextNodeId: null,
                    registerUpdates: registerUpdateValues,
                };
            }
            else{
                const _exhaustiveCheck: never = transition;
                throw new Error(`Unhandled transition: ${JSON.stringify(_exhaustiveCheck)}`);
            }
        }
        case "IfThenElse": {
            // Evaluate condition
            const cond = evl(
                transition.if,
                {
                    graphRegisters: registers,
                    localVariables: {},
                    lastAction:lastAction,
                    lastSubgraphRegisters: lastSubgraphRegisters,

                },
            );
            if (cond) {
                return evalTransition({
                    transition: transition.then,
                    registers,
                    lastAction:lastAction,
                    lastSubgraphRegisters: lastSubgraphRegisters,

                });
            } else {
                return evalTransition({
                    transition: transition.else,
                    registers,
                    lastAction:lastAction,
                    lastSubgraphRegisters: lastSubgraphRegisters,

                });
            }
        }
        case "Switch": {
            const selector = evl(
                transition.on,
                {
                    graphRegisters: registers,
                    localVariables: {},
                    lastAction:lastAction,
                    lastSubgraphRegisters: lastSubgraphRegisters,

                },
            );

            for (const [value, then] of transition.cases.entries()) {
                if (selector === value) {
                    return evalTransition({
                        transition: then,
                        registers,
                        lastAction:lastAction,
                        lastSubgraphRegisters: lastSubgraphRegisters,

                    });
                }
            }

            // Default case
            return evalTransition({
                transition: transition.default,
                registers,
                lastAction:lastAction,
                lastSubgraphRegisters: lastSubgraphRegisters,
            });
        }
        default:
            const _exhaustiveCheck: never = transition;
            throw new Error(`Unhandled transition: ${JSON.stringify(_exhaustiveCheck)}`);
    }
}
