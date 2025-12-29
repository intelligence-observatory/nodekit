import type {RegisterId, Value} from "./types/values.ts";
import type {Action} from "./types/actions.ts";
import type {Expression, LocalVariableName} from "./types/expressions/expressions.ts";

export interface EvlContext {
    graphRegisters: Record<RegisterId, Value>,
    lastAction: Action | null,
    lastSubgraphRegisters: Record<RegisterId, Value> | null,
    localVariables: Record<LocalVariableName, Value>,
}


export function evl(
    expression: Expression,
    context: EvlContext,
): Value  {
    switch (expression.op) {
        // =====================
        // Root
        // =====================
        case "reg": {
            if (!(expression.id in context.graphRegisters)) {
                throw new Error(`Graph Register '${expression.id}' not found`);
            }
            return context.graphRegisters[expression.id]
        }
        case "creg": {
            if (context.lastSubgraphRegisters === null) {
                throw new Error(`No last subgraph registers available for 'creg'`);
            }
            if (!(expression.id in context.lastSubgraphRegisters)) {
                throw new Error(`Child Graph Register '${expression.id}' not found`);
            }
            return context.lastSubgraphRegisters[expression.id];
        }
        case "la": {
            if (context.lastAction === null) {
                throw new Error(`No last action available for 'la'`);
            }
            return context.lastAction.action_value;
        }
        case "gdv" :{
            const dictVal = evl(
                expression.d,
                context,
            );
            if (typeof dictVal !== "object" || dictVal === null || Array.isArray(dictVal)) {
                throw new Error(`gdv: dict must be object, got '${typeof dictVal}'`);
            }

            const keyVal = evl(
                expression.key,
                context,
            );
            if (typeof keyVal !== "string") {
                throw new Error(`gdv: key must be string, got '${typeof keyVal}'`);
            }

            if (!(keyVal in dictVal)) {
                throw new Error(`gdv: key '${keyVal}' not found in dict`);
            }

            return (dictVal as Record<string, Value>)[keyVal];
        }
        case "lit": {
            return expression.value;
        }
        // =====================
        // Conditional
        // =====================
        case "if": {
            const condVal = evl(
                expression.cond,
                context,
            );
            if (condVal) {
                return evl(
                    expression.then,
                    context,
                );
            } else {
                return evl(
                    expression.otherwise,
                    context,
                );
            }
        }
        // =====================
        // Boolean logic
        // =====================
        case "not": {
            const v = evl(
                expression.operand,
                context,
            );
            return !v;
        }
        case "and": {
            // short-circuit
            for (const arg of expression.args) {
                const v = evl(
                    arg, context,);
                if (typeof v !== "boolean") {
                    throw new Error(`and: all args must be boolean, got '${typeof v}'`);
                }
                if (!v) return false;
            }
            return true;
        }
        case "or": {
            // short-circuit
            for (const arg of expression.args) {
                const v = evl(arg, context,);
                if (typeof v !== "boolean") {
                    throw new Error(`or: all args must be boolean, got '${typeof v}'`);
                }
                if (v) return true;
            }
            return false;
        }
        // =====================
        // Comparators
        // =====================
        case "eq": {
            const lhs = evl(
                expression.lhs,
                context,
            );
            const rhs = evl(
                expression.rhs,
                context,
            );
            return lhs === rhs;
        }
        case "ne": {
            const lhs = evl(
                expression.lhs,
                context,
            );
            const rhs = evl(
                expression.rhs,
                context,
            );
            return lhs !== rhs;
        }
        case "gt":
        case "ge":
        case "lt":
        case "le": {
            const lhs = evl(
                expression.lhs,
                context,
            );
            const rhs = evl(
                expression.rhs,
                context,
            );

            if (typeof lhs !== typeof rhs) {
                throw new Error(
                    `${expression.op}: lhs and rhs must have same type, got '${typeof lhs}' and '${typeof rhs}'`
                );
            }
            if (typeof lhs !== "number" && typeof lhs !== "string") {
                throw new Error(
                    `${expression.op}: only number or string comparison supported, got '${typeof lhs}'`
                );
            }

            switch (expression.op) {
                case "gt":
                    return (lhs as any) > (rhs as any);
                case "ge":
                    return (lhs as any) >= (rhs as any);
                case "lt":
                    return (lhs as any) < (rhs as any);
                case "le":
                    return (lhs as any) <= (rhs as any);
                default:
                    const _exhaustive: never = expression;
                    throw new Error(`Unsupported comparator op: ${(_exhaustive as any).op}`);
            }
        }
        // =====================
        // Arithmetic
        // =====================
        case "add":
        case "sub":
        case "mul":
        case "div": {
            const lhs = evl(
                expression.lhs,
                context,
            );
            const rhs = evl(
                expression.rhs,
                context,
            );

            if (typeof lhs !== "number" || typeof rhs !== "number") {
                throw new Error(
                    `${expression.op}: operands must be numbers, got '${typeof lhs}' and '${typeof rhs}'`
                );
            }

            switch (expression.op) {
                case "add":
                    return lhs + rhs;
                case "sub":
                    return lhs - rhs;
                case "mul":
                    return lhs * rhs;
                case "div":
                    if (rhs === 0) {
                        throw new Error("div: division by zero");
                    }
                    return lhs / rhs;
                default:
                    const _exhaustive: never = expression;
                    throw new Error(`Unsupported arithmetic op: ${(_exhaustive as any).op}`);
            }
        }
        default: {
            const _exhaustive: never = expression;
            throw new Error(`Unsupported expression op: ${(_exhaustive as any).op}`);
        }
    }
}
