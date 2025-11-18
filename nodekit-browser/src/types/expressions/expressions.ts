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