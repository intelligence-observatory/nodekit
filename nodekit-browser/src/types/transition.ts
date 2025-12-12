import type {Expression} from "./expressions/expressions.ts";
import type {LeafValue, NodeId, RegisterId} from "./value.ts";

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

type LeafTransition = Go | End;

export interface IfThenElse extends BaseTransition<'IfThenElse'> {
    if: Expression
    then: LeafTransition
    else: LeafTransition
}

export interface Switch extends BaseTransition<'Switch'> {
    /*
    N-way structured switch. No fallthrough; first matching case is taken.
    If no matches, take default.
     */
    on: Expression
    cases: Map<LeafValue, LeafTransition>
    default: LeafTransition // Default case if no matches
}

export type Transition =
    | Go
    | Switch
    | IfThenElse
    | End;
