import type {List, RegisterId, Value} from "../types/value.ts";
import type {Action} from "../types/actions";
import type {Expression, LocalVariableName} from "../types/expressions/expressions.ts";

export interface EvlContext {
    graphRegisters: Record<RegisterId, Value>,
    lastAction: Action
    localVariables: Record<LocalVariableName, Value>
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
        case "local": {
            if (!(expression.name in context.localVariables)) {
                throw new Error(`Local variable '${expression.name}' not found`);
            }
            return context.localVariables[expression.name];
        }
        case "la": {
            return context.lastAction;
        }
        case "gli": {
            const listVal = evl(
                expression.list,
                context,
            );
            if (!Array.isArray(listVal)) {
                throw new Error(`gli: list must be array, got '${typeof listVal}'`);
            }

            const indexVal = evl(
                expression.index,
                context,
            );
            if (typeof indexVal !== "number") {
                throw new Error(`gli: index must be number, got '${typeof indexVal}'`);
            }

            if (indexVal < 0 || indexVal >= listVal.length) {
                throw new Error(`gli: index out of bounds, got index ${indexVal} for list of length ${listVal.length}`);
            }
            return listVal[indexVal];
        }
        case "gdv" :{
            const dictVal = evl(
                expression.dict,
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
        // =====================
        // Array ops
        // =====================
        case "append":{
            const arrayVal = evl(
                expression.array,
                context,
            );

            if (!Array.isArray(arrayVal)) {
                throw new Error(`append: array must be array, got '${typeof arrayVal}'`);
            }

            const valueVal = evl(
                expression.value,
                context,
            );

            return [...arrayVal, valueVal] as List;
        }
        case "concat": {
            const arrayVal = evl(
                expression.array,
                context,
            );

            if (!Array.isArray(arrayVal)) {
                throw new Error(`concat: array must be array, got '${typeof arrayVal}'`);
            }

            const valueVal = evl(
                expression.value,
                context,
            );

            if (!Array.isArray(valueVal)) {
                throw new Error(`concat: value must be array, got '${typeof valueVal}'`);
            }

            return [...arrayVal, ...valueVal] as List;
        }
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
            const baseLocals = context.localVariables;

            return arrayVal.map((elem) => evl(
                expression.func,
                {
                    ...context,
                    localVariables: {
                        ...baseLocals,
                        [curName]: elem,
                    },
                },
            )) as List;
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
            const baseLocals = context.localVariables;

            const result: List = [];
            for (const elem of arrayVal) {
                const keep = evl(
                    expression.predicate,
                    {
                        ...context,
                        localVariables: {
                            ...baseLocals,
                            [curName]: elem,
                        },
                    },
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
            const baseLocals = context.localVariables;

            for (const elem of arrayVal) {
                acc = evl(
                    expression.func,
                    {
                        ...context,
                        localVariables: {
                            ...baseLocals,
                            [accName]: acc,
                            [curName]: elem,
                        },
                    },
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
