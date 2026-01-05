import type {Expression} from "./expressions/expressions.ts";
import type {NodeId, RegisterId} from "./values.ts";

interface BaseTransition<T extends string> {
    transition_type: T
}

export interface End extends BaseTransition<'End'> {
    register_updates: Record<RegisterId, Expression>
}

export interface Go extends BaseTransition<'Go'> {
    // Leaf. Constant transition.
    to: NodeId
    register_updates: Record<RegisterId, Expression>
}

export interface IfThenElse extends BaseTransition<'IfThenElse'> {
    if: Expression
    then: Transition
    else: Transition
}

export type Transition =
    | Go
    | IfThenElse
    | End;
