import type {RegisterId, String, Value} from "../values.ts";

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
     * Evaluates to the last completed Node's Action.action_value.
     */
    op: "la";
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

export type Expression =
    // Root
    | Reg
    | ChildReg
    | LastAction
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
    ;
