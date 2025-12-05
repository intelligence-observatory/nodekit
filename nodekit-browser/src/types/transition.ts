import type {Expression} from "./expressions/expressions.ts";
import type {NodeId, RegisterId} from "./value.ts";

interface BaseTransition<T extends string> {
    transition_type: T
}

export interface End extends BaseTransition<'End'> {
    // Leaf. Exit the Graph!
}

export interface Go extends BaseTransition<'Go'> {
    // Leaf. Constant transition.
    to: NodeId
    register_updates: Record<RegisterId, Expression>
}

type LeafTransition = Go | End;

export interface Branch extends BaseTransition<'Branch'> {
    /*
    N-way structured switch. No fallthrough; first matching case is taken.
    If no matches, take default.
     */
    cases: Array<{
        when: Expression
        then: LeafTransition
    }>
    otherwise: LeafTransition // Default case if no matches
}

export type Transition =
    | Go
    | Branch
    | End;
