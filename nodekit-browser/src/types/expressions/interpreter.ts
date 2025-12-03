import type {List, RegisterId, Value} from "../value.ts";
import type {Action} from "../actions";
import type {Expression, LocalVariableName} from "./expressions.ts";

export interface EvlContext {
    graph_registers: Record<RegisterId, Value>,
    local_variables: Record<LocalVariableName, Value>,
    last_action: Action
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
            if (!(expression.id in context.graph_registers)) {
                throw new Error(`Graph register '${expression.id}' not found`);
            }
            return context.graph_registers[expression.id]
        }
        case "loc": {
            if (!(expression.name in context.local_variables)) {
                throw new Error(`Local variable '${expression.name}' not found`);
            }
            return context.local_variables[expression.name];
        }
        case "la": {
            return context.last_action;
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
            return !v as Boolean;
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
            // strict equality; you can swap this for deep equality if needed
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
            }
        }

        // =====================
        // Array ops
        // =====================
        case "slice": {
            const arrayVal = evl(
                expression.array,
                context,
            );

            if (!Array.isArray(arrayVal)) {
                throw new Error(`slice: array must be array, got '${typeof arrayVal}'`);
            }

            const startVal = evl(
                expression.start,
                context,
            );
            if (typeof startVal !== "number") {
                throw new Error(`slice: start must be number, got '${typeof startVal}'`);
            }

            let endVal: number | undefined;
            if (expression.end !== null) {
                const evEnd = evl(
                    expression.end,
                    context,
                );
                if (typeof evEnd !== "number") {
                    throw new Error(`slice: end must be number, got '${typeof evEnd}'`);
                }
                endVal = evEnd;
            }
            return arrayVal.slice(startVal, endVal) as List;
        }
        case "map": {
            const arrayVal = evl(
                expression.array,
                context,
            );

            if (!Array.isArray(arrayVal)) {
                throw new Error(`map: array must be array, got '${typeof arrayVal}'`);
            }

            const curName = expression.cur;

            return arrayVal.map((elem) => {
                context.local_variables = {
                    ...context.local_variables,
                    [curName]: elem,
                };
                return evl(
                    expression.func,
                    context,
                );
            }) as List;
        }

        case "filter": {
            const arrayVal = evl(
                expression.array,
                context,
            );
            if (!Array.isArray(arrayVal)) {
                throw new Error(`filter: array must be array, got '${typeof arrayVal}'`);
            }

            const curName = expression.cur;

            const result: List = [];
            for (const elem of arrayVal) {
                context.local_variables = {
                    ...context.local_variables,
                    [curName]: elem,
                };
                const keep = evl(
                    expression.predicate,
                    context,
                );
                if (typeof keep !== "boolean") {
                    throw new Error(
                        `filter: predicate must be boolean, got '${typeof keep}'`
                    );
                }
                if (keep) {
                    result.push(elem);
                }
            }
            return result;
        }

        case "fold": {
            const arrayVal = evl(
                expression.array,
                context,
            );
            if (!Array.isArray(arrayVal)) {
                throw new Error(`fold: array must be array, got '${typeof arrayVal}'`);
            }

            let acc = evl(
                expression.init,
                context,
            );
            const accName = expression.acc;
            const curName = expression.cur;

            for (const elem of arrayVal) {
                context.local_variables = {
                    ...context.local_variables,
                    [accName]: acc,
                    [curName]: elem,
                };
                acc = evl(
                    expression.func,
                    context,
                );
            }
            return acc;
        }

        default: {
            const _exhaustive: never = expression;
            throw new Error(`Unsupported expression op: ${(_exhaustive as any).op}`);
        }
    }
}
