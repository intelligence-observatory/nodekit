export type BaseValue = string | number | boolean;
// Note: TypeScript does not distinguish int vs float; both are `number`.

export type StructKey = string;

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
    | "last_outcome"
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

export interface LastOutcome extends BaseExpression {
    op: "last_outcome";
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
    | LastOutcome
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
export function evl(
    expression: Expression,
    gvs: VariableFile,
    lvs: VariableFile,
): Value {
    function evalInner(expr: Expression, g: VariableFile, l: VariableFile): Value {
        switch (expr.op) {
            // =====================
            // Root
            // =====================
            case "var": {
                const scope = expr.scope ?? "g";
                const name = expr.name;
                if (scope === "l") {
                    if (!(name in l)) {
                        throw new Error(`Local variable '${name}' not found`);
                    }
                    return l[name];
                } else {
                    if (!(name in g)) {
                        throw new Error(`Global variable '${name}' not found`);
                    }
                    return g[name];
                }
            }

            case "last_outcome": {
                // Convention: last outcome lives in a special global variable.
                const key = "__last_outcome";
                if (!(key in g)) {
                    throw new Error(
                        "LastOutcome requested but gvs['__last_outcome'] is not set",
                    );
                }
                return g[key];
            }

            case "get": {
                const containerVal = evalInner(expr.container, g, l);

                if (Array.isArray(containerVal)) {
                    const idx = expr.key;
                    if (typeof idx !== "number") {
                        throw new Error(
                            `Get: expected numeric index for array, got ${typeof idx}`,
                        );
                    }
                    if (idx < 0 || idx >= containerVal.length) {
                        throw new Error(`Get: index ${idx} out of bounds`);
                    }
                    return containerVal[idx];
                }

                if (
                    containerVal !== null &&
                    typeof containerVal === "object" &&
                    !Array.isArray(containerVal)
                ) {
                    const key = String(expr.key);
                    if (!(key in containerVal)) {
                        throw new Error(`Get: key '${key}' not found in struct`);
                    }
                    // Struct is Record<string, Value>
                    return (containerVal as Struct)[key];
                }

                throw new Error(
                    `Get: container must be array or struct, got ${typeof containerVal}`,
                );
            }

            case "lit": {
                // Values are assumed immutable or treated as such;
                // if you want, you can deep-clone here.
                return expr.value;
            }

            // =====================
            // Conditional
            // =====================
            case "if": {
                const condVal = evalInner(expr.cond, g, l);
                if (typeof condVal !== "boolean") {
                    throw new Error(`If: condition must be boolean, got ${typeof condVal}`);
                }
                return condVal
                    ? evalInner(expr.then, g, l)
                    : evalInner(expr.otherwise, g, l);
            }

            // =====================
            // Boolean logic
            // =====================
            case "not": {
                const v = evalInner(expr.operand, g, l);
                if (typeof v !== "boolean") {
                    throw new Error(`Not: operand must be boolean, got ${typeof v}`);
                }
                return !v;
            }

            case "or": {
                // Identity for empty OR is false.
                let result = false;
                for (const arg of expr.args) {
                    const v = evalInner(arg, g, l);
                    if (typeof v !== "boolean") {
                        throw new Error(`Or: all arguments must be boolean, got ${typeof v}`);
                    }
                    if (v) {
                        return true; // short-circuit
                    }
                }
                return result;
            }

            case "and": {
                // Identity for empty AND is true.
                let result = true;
                for (const arg of expr.args) {
                    const v = evalInner(arg, g, l);
                    if (typeof v !== "boolean") {
                        throw new Error(
                            `And: all arguments must be boolean, got ${typeof v}`,
                        );
                    }
                    if (!v) {
                        return false; // short-circuit
                    }
                }
                return result;
            }

            // =====================
            // Comparators
            // =====================
            case "eq": {
                const lhs = evalInner(expr.lhs, g, l);
                const rhs = evalInner(expr.rhs, g, l);
                return deepEqual(lhs, rhs);
            }

            case "ne": {
                const lhs = evalInner(expr.lhs, g, l);
                const rhs = evalInner(expr.rhs, g, l);
                return !deepEqual(lhs, rhs);
            }

            case "gt":
            case "ge":
            case "lt":
            case "le": {
                const lhs = evalInner(expr.lhs, g, l);
                const rhs = evalInner(expr.rhs, g, l);

                if (typeof lhs !== "number" || typeof rhs !== "number") {
                    throw new Error(
                        `${expr.op}: both operands must be numbers, got ${typeof lhs} and ${typeof rhs}`,
                    );
                }

                switch (expr.op) {
                    case "gt":
                        return lhs > rhs;
                    case "ge":
                        return lhs >= rhs;
                    case "lt":
                        return lhs < rhs;
                    case "le":
                        return lhs <= rhs;
                }
            }

            // =====================
            // Arithmetic
            // =====================
            case "add":
            case "sub":
            case "mul":
            case "div": {
                const lhs = evalInner(expr.lhs, g, l);
                const rhs = evalInner(expr.rhs, g, l);

                if (typeof lhs !== "number" || typeof rhs !== "number") {
                    throw new Error(
                        `${expr.op}: both operands must be numbers, got ${typeof lhs} and ${typeof rhs}`,
                    );
                }

                switch (expr.op) {
                    case "add":
                        return lhs + rhs;
                    case "sub":
                        return lhs - rhs;
                    case "mul":
                        return lhs * rhs;
                    case "div":
                        return lhs / rhs;
                }
            }

            // =====================
            // Array operations
            // =====================
            case "slice": {
                const arrVal = evalInner(expr.array, g, l);
                if (!Array.isArray(arrVal)) {
                    throw new Error(`Slice: array expression must evaluate to an array`);
                }

                const startVal = evalInner(expr.start, g, l);
                if (typeof startVal !== "number") {
                    throw new Error(
                        `Slice: start index must be a number, got ${typeof startVal}`,
                    );
                }

                let endVal: number | undefined;
                if (expr.end !== null) {
                    const e = evalInner(expr.end, g, l);
                    if (typeof e !== "number") {
                        throw new Error(
                            `Slice: end index must be a number, got ${typeof e}`,
                        );
                    }
                    endVal = e;
                }

                const len = arrVal.length;
                const startIdx = normalizeSliceIndex(startVal, len);
                const endIdx =
                    endVal === undefined
                        ? len
                        : normalizeSliceIndex(endVal, len);

                return arrVal.slice(startIdx, endIdx);
            }

            case "map": {
                const arrVal = evalInner(expr.array, g, l);
                if (!Array.isArray(arrVal)) {
                    throw new Error(`Map: array expression must evaluate to an array`);
                }

                const curName = expr.cur ?? "xcur";

                return arrVal.map((elem) => {
                    const extendedL: VariableFile = { ...l, [curName]: elem };
                    return evalInner(expr.func, g, extendedL);
                });
            }

            case "filter": {
                const arrVal = evalInner(expr.array, g, l);
                if (!Array.isArray(arrVal)) {
                    throw new Error(`Filter: array expression must evaluate to an array`);
                }

                const curName = expr.cur ?? "xcur";

                return arrVal.filter((elem) => {
                    const extendedL: VariableFile = { ...l, [curName]: elem };
                    const predVal = evalInner(expr.predicate, g, extendedL);
                    if (typeof predVal !== "boolean") {
                        throw new Error(
                            `Filter: predicate must evaluate to boolean, got ${typeof predVal}`,
                        );
                    }
                    return predVal;
                });
            }

            case "fold": {
                const arrVal = evalInner(expr.array, g, l);
                if (!Array.isArray(arrVal)) {
                    throw new Error(`Fold: array expression must evaluate to an array`);
                }

                const initVal = evalInner(expr.init, g, l);
                const accName = expr.acc ?? "xagg";
                const curName = expr.cur ?? "xcur";

                let acc: Value = initVal;

                for (const elem of arrVal) {
                    const extendedL: VariableFile = {
                        ...l,
                        [accName]: acc,
                        [curName]: elem,
                    };
                    acc = evalInner(expr.func, g, extendedL);
                }

                return acc;
            }
        }

        // Exhaustiveness guard
        const _never: never = expr;
        throw new Error(`Unhandled expression op: ${(JSON.stringify(_never))}`);
    }

    return evalInner(expression, gvs, lvs);
}

// =====================
// Helpers
// =====================

function deepEqual(a: Value, b: Value): boolean {
    if (a === b) return true;

    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA !== typeB) return false;

    // Primitive mismatch is already handled by a===b;
    if (a === null || b === null) return a === b;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }

    if (
        typeof a === "object" &&
        typeof b === "object" &&
        !Array.isArray(a) &&
        !Array.isArray(b)
    ) {
        const keysA = Object.keys(a as Struct);
        const keysB = Object.keys(b as Struct);
        if (keysA.length !== keysB.length) return false;
        for (const k of keysA) {
            if (!(k in (b as Struct))) return false;
            if (!deepEqual((a as Struct)[k], (b as Struct)[k])) return false;
        }
        return true;
    }

    // Fallback for weird cases; for our Value domain this shouldn't really happen.
    return false;
}

function normalizeSliceIndex(idx: number, length: number): number {
    let i = Math.trunc(idx);
    if (i < 0) i = length + i;
    if (i < 0) i = 0;
    if (i > length) i = length;
    return i;
}