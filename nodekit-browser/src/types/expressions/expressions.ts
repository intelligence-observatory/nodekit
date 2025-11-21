import type {RegisterId} from "../common.ts";
import type {Action} from "../actions";

export type BaseValue = string | number | boolean;
// Note: TypeScript does not distinguish int vs float; both are `number`.

export type StructKey = string; // Dot notation is expected

// Recursive JSON-like struct: map from string to Value.
export type Struct = { [key: StructKey]: Value };

export type ArrayIndex = number;

// Recursive array of Values
export type ArrayValue = Value[];

// Full Value type
export type Value = BaseValue | ArrayValue | Struct;

export type VariableName = string;

// =====================
// Op tag (no enums)
// =====================

export type Op =
    | "var"
    | "af" // action field
    | "get"
    | "lit"
    | "if"
    | "not"
    | "and"
    | "or"
    | "eq"
    | "ne"
    | "gt"
    | "ge"
    | "lt"
    | "le"
    | "add"
    | "sub"
    | "mul"
    | "div"
    | "slice"
    | "map"
    | "filter"
    | "fold";


// =====================
// Base expression
// =====================

export interface BaseExpression {
    op: Op;
}

// =====================
// Root expressions
// =====================

export interface Var extends BaseExpression {
    op: "var";
    name: VariableName;
    /**
     * Whether to read from the local (l) or global (g) variable file.
     * Default at runtime: 'g'.
     */
    scope?: "l" | "g";
}

export interface ActionField extends BaseExpression {
    /**
     * Access a field in the last Action.
     */
    op: "af";
    key: StructKey
}

export interface Get extends BaseExpression {
    /**
     * Get an element from a container (Array or Struct).
     */
    op: "get";
    // Expression must evaluate to an array- or struct-valued result
    container: Expression;
    // ArrayIndex or StructKey
    key: StructKey | ArrayIndex;
}

export interface Lit extends BaseExpression {
    /**
     * Literal value.
     */
    op: "lit";
    value: Value;
}

// =====================
// Conditional
// =====================

export interface If extends BaseExpression {
    op: "if";
    cond: Expression;
    then: Expression;
    otherwise: Expression;
}

// =====================
// Boolean logic
// =====================

export interface Not extends BaseExpression {
    op: "not";
    operand: Expression;
}

export interface Or extends BaseExpression {
    op: "or";
    // variadic
    args: Expression[];
}

export interface And extends BaseExpression {
    op: "and";
    // variadic
    args: Expression[];
}

// =====================
// Binary comparators
// =====================

export interface BaseCmp extends BaseExpression {
    lhs: Expression;
    rhs: Expression;
}

export interface Eq extends BaseCmp {
    op: "eq";
}

export interface Ne extends BaseCmp {
    op: "ne";
}

export interface Gt extends BaseCmp {
    op: "gt";
}

export interface Ge extends BaseCmp {
    op: "ge";
}

export interface Lt extends BaseCmp {
    op: "lt";
}

export interface Le extends BaseCmp {
    op: "le";
}

// =====================
// Arithmetic
// =====================

export interface BaseArithmeticOperation extends BaseExpression {
    lhs: Expression;
    rhs: Expression;
}

export interface Add extends BaseArithmeticOperation {
    op: "add";
}

export interface Sub extends BaseArithmeticOperation {
    op: "sub";
}

export interface Mul extends BaseArithmeticOperation {
    op: "mul";
}

export interface Div extends BaseArithmeticOperation {
    op: "div";
}

// =====================
// Array operations
// =====================

export interface ArrayOp extends BaseExpression {
    // Expression must be array-valued at runtime
    array: Expression;
}

export interface Slice extends ArrayOp {
    op: "slice";
    start: Expression;
    end: Expression | null;
}

export interface Map extends ArrayOp {
    op: "map";
    /**
     * The variable name of the current array element.
     * Default at runtime: 'xcur'.
     */
    cur?: VariableName;
    /**
     * Expression that will be applied to each element of the array.
     */
    func: Expression;
}

export interface Filter extends ArrayOp {
    op: "filter";
    /**
     * The variable name of the current array element.
     * Default at runtime: 'xcur'.
     */
    cur?: VariableName;
    /**
     * Expression that will be applied to each element of the array
     * and interpreted as a predicate.
     */
    predicate: Expression;
}

export interface Fold extends ArrayOp {
    op: "fold";
    init: Expression;
    /**
     * The ID of the current cumulant.
     * Default at runtime: 'xagg'.
     */
    acc?: VariableName;
    /**
     * The variable name of the current array element.
     * Default at runtime: 'xcur'.
     */
    cur?: VariableName;
    func: Expression;
}

// =====================
// Discriminated union
// =====================

export type Expression =
// Root
    | Var
    | ActionField
    | Get
    | Lit
    // Logic
    | If
    // Boolean
    | Not
    | Or
    | And
    // Comparators
    | Eq
    | Ne
    | Gt
    | Ge
    | Lt
    | Le
    // Arithmetic
    | Add
    | Sub
    | Mul
    | Div
    // Array ops
    | Slice
    | Map
    | Filter
    | Fold;

// =====================
// Variable file
// =====================

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
            break
        }
        case "get": {
            const containerVal = evl(
                expression.container,
                context,
            );
            const key = expression.key;

            if (Array.isArray(containerVal)) {
                if (typeof key !== "number") {
                    throw new Error(`Array index must be a number, got '${typeof key}'`);
                }
                if (key < 0 || key >= containerVal.length) {
                    throw new Error(`Array index '${key}' out of bounds`);
                }
                return containerVal[key] as Value;
            }

            if (containerVal && typeof containerVal === "object") {
                const structVal = containerVal as Struct;
                if (typeof key !== "string") {
                    throw new Error(`Struct key must be a string, got '${typeof key}'`);
                }
                if (!(key in structVal)) {
                    throw new Error(`Struct key '${key}' not found`);
                }
                return structVal[key];
            }

            throw new Error(
                `get: container must be array or struct, got '${typeof containerVal}'`
            );
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

            return arrayVal.slice(startVal, endVal) as ArrayValue;
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
            }) as ArrayValue;
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

            const result: ArrayValue = [];
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
            const accName = expression.acc ?? "xagg";
            const curName = expression.cur ?? "xcur";

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