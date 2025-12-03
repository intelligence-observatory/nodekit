import type {RegisterId} from "../common.ts";
import type {Action} from "../actions";
import type {Array, ArrayIndex, Expression, Struct, StructKey, Value, VariableName} from "./expressions.ts";

function accessContainerValue(
    container: any, // Todo
    containerKey: StructKey | ArrayIndex,
): Value {


    if (Array.isArray(container)) {
        // Array branch: require numeric index
        if (typeof containerKey !== "number" || !Number.isInteger(containerKey)) {
            throw new Error(
                `Expected numeric ArrayIndex, got '${String(containerKey)}'`,
            );
        }

        const idx = containerKey;
        if (idx < 0 || idx >= container.length) {
            throw new Error(
                `Array index out of bounds: index=${idx}, length=${container.length}`,
            );
        }
        return container[idx];
    } else if (typeof container === "object") {
        // Struct branch: require string key
        if (typeof containerKey !== "string") {
            throw new Error(
                `Expected string StructKey, got '${String(containerKey)}'`,
            );
        }

        return accessStructValue(
            container,
            containerKey,
        );
    } else {
        throw new Error(`Did not receive a valid container Value; got ${container}`)
    }


}

// Container utils
function accessStructValue(
    struct: Struct,
    key: StructKey,
): Value {
    // Allow "" or "." to mean "root"
    if (key === "" || key === ".") {
        return struct;
    }

    // Support leading dot: ".foo.0.1" -> ["foo", "0", "1"]
    const segments = key.split(".").filter(seg => seg.length > 0);

    let current: Value = struct;

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];

        if (Array.isArray(current)) {
            // Array case: segment must be an integer index
            const idx = Number(seg);
            if (!Number.isInteger(idx)) {
                const traversed = segments.slice(0, i).join(".") || "<root>";
                throw new Error(
                    `Expected numeric index at segment '${seg}' while traversing '${traversed}'`,
                );
            }
            if (idx < 0 || idx >= current.length) {
                const traversed = segments.slice(0, i).join(".") || "<root>";
                throw new Error(
                    `Array index out of bounds at segment '${seg}' (index=${idx}) while traversing '${traversed}', length=${current.length}`,
                );
            }
            current = current[idx];
            continue;
        }

        if (typeof current === "object" && current !== null) {
            // Struct case
            const currentStruct = current as Struct;
            if (!(seg in currentStruct)) {
                const traversed = segments.slice(0, i).join(".") || "<root>";
                throw new Error(
                    `Key '${seg}' not found while traversing '${traversed}' in path '${key}'`,
                );
            }
            current = currentStruct[seg];
            continue;
        }

        // Neither struct nor array: cannot descend further
        const traversed = segments.slice(0, i).join(".") || "<root>";
        throw new Error(
            `Cannot access segment '${seg}' at '${traversed}': current value is not indexable`,
        );
    }

    return current;
}

export type VariableFile = Record<VariableName, Value>;

export interface EvlContext {
    graph_registers: Record<RegisterId, Value>,
    local_variables: VariableFile,
    last_action: Action
}

export function evl(
    expression: Expression,
    context: EvlContext,
): Value {
    switch (expression.op) {
        // =====================
        // Root
        // =====================
        case "var": {
            const scope = expression.scope ?? "g";
            if (scope === "l") {
                if (!(expression.name in context.local_variables)) {
                    throw new Error(`Local variable '${expression.name}' not found`);
                }
                return context.local_variables[expression.name];
            } else {
                if (!(expression.name in context.graph_registers)) {
                    throw new Error(`Graph register '${expression.name}' not found`);
                }
                return context.graph_registers[expression.name as RegisterId];
            }
        }
        case "af": {

            return accessContainerValue(context.last_action, expression.key)
        }
        case "get": {
            const containerVal = evl(
                expression.container,
                context,
            );
            const key = expression.key;
            return accessContainerValue(containerVal, key)
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
            if (typeof condVal !== "boolean") {
                throw new Error(`if: condition must be boolean, got '${typeof condVal}'`);
            }
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
            if (typeof v !== "boolean") {
                throw new Error(`not: operand must be boolean, got '${typeof v}'`);
            }
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

            return arrayVal.slice(startVal, endVal) as Array;
        }

        case "map": {
            const arrayVal = evl(
                expression.array,
                context,
            );
            if (!Array.isArray(arrayVal)) {
                throw new Error(`map: array must be array, got '${typeof arrayVal}'`);
            }

            const curName = expression.cur ?? "xcur";

            return arrayVal.map((elem) => {
                context.local_variables = {
                    ...context.local_variables,
                    [curName]: elem,
                };
                return evl(
                    expression.func,
                    context,
                );
            }) as Array;
        }

        case "filter": {
            const arrayVal = evl(
                expression.array,
                context,
            );
            if (!Array.isArray(arrayVal)) {
                throw new Error(`filter: array must be array, got '${typeof arrayVal}'`);
            }

            const curName = expression.cur ?? "xcur";

            const result: Array = [];
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