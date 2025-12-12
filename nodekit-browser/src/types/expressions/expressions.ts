import type {RegisterId, String, Value} from "../value.ts";

export type LocalVariableName = String;

export interface BaseExpression {
    op: string;
}

// =====================
// Root expressions
// =====================
export interface Reg extends BaseExpression {
    /**
     * Evaluates to the value stored in the specified Graph Register.
     */
    op: "reg";
    id: RegisterId;
}

export interface ChildReg extends BaseExpression {
    /**
     * Evaluates to the value stored in the last completed subGraph's Register.
     */
    op: "creg";
    id: RegisterId;
}

export interface Local extends BaseExpression {
    /**
     * Evaluates to the value of the specified Local Variable.
     */
    op: "local";
    name: LocalVariableName;
}

export interface LastAction extends BaseExpression {
    /**
     * Evaluates to the last completed Node's Action.
     */
    op: "la";
}

export interface GetListItem extends BaseExpression {
    /**
     * Get an item from a List.
     */
    op: "gli";
    list: Expression;
    index: Expression;
}

export interface GetDictValue extends BaseExpression {
    /**
     * Get a value from a Dict.
     */
    op: "gdv";
    d: Expression;
    key: Expression;
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
export interface ListOp extends BaseExpression {
    // Expression must be array-valued at runtime
    array: Expression;
}

export interface Append extends ListOp {
    op: "append";
    value: Expression;
}

export interface Concat extends ListOp {
    op: "concat";
    value: Expression;
}

export interface Slice extends ListOp {
    op: "slice";
    start: Expression;
    end: Expression | null;
}

export interface Map extends ListOp {
    op: "map";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array.
     */
    func: Expression;
}

export interface Filter extends ListOp {
    op: "filter";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array
     * and interpreted as a predicate.
     */
    predicate: Expression;
}

export interface Fold extends ListOp {
    op: "fold";
    init: Expression;
    /**
     * The variable name the cumulant will be assigned to. Can be referenced in the func: Expression with Var(...).
     */
    acc: LocalVariableName;
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    func: Expression;
}

export type Expression =
    // Root
    | Reg
    | ChildReg
    | Local
    | LastAction
    | GetListItem
    | GetDictValue
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
    | Append
    | Concat
    | Slice
    | Map
    | Filter
    | Fold;
