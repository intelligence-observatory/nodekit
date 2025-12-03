import type {Boolean, String, Dict, Float, Integer, List, RegisterId, Value} from "../value.ts";
import type {Action} from "../actions";

export type LocalVariableName = String;

export interface BaseExpression<V> {
    op: string;
    __result?: V
}

// =====================
// Root expressions
// =====================
export interface Reg<V=Value> extends BaseExpression<V> {
    /**
     * Evaluates to the value stored in the specified Graph Register.
     */
    op: "reg";
    id: RegisterId;
}

export interface Local<V=Value> extends BaseExpression<V> {
    /**
     * Evaluates to the value of the specified Local Variable.
     */
    op: "loc";
    name: LocalVariableName;
}

export interface LastAction extends BaseExpression<Action> {
    /**
     * Evaluates to the last completed Node's Action, which is a Dict.
     */
    op: "la"
}

export interface GetListItem<V=Value> extends BaseExpression<V> {
    /**
     * Get an item from a List.
     */
    op: "gli";
    list: Expression<List>;
    index: Expression<Integer>;
}
export interface GetDictValue<V=Value> extends BaseExpression<V> {
    /**
     * Get a value from a Dict.
     */
    op: "gdv";
    dict: Expression<Dict>;
    key: Expression<String>;
}

export interface Lit<V=Value> extends BaseExpression<V> {
    /**
     * Literal value.
     */
    op: "lit";
    value: V;
}

// =====================
// Conditional
// =====================
export interface If<V=Value> extends BaseExpression<V> {
    op: "if";
    cond: Expression<Boolean>;
    then: Expression<V>;
    otherwise: Expression<V>;
}

// =====================
// Boolean logic
// =====================
export interface Not extends BaseExpression<Boolean> {
    op: "not";
    operand: Expression;
}

export interface Or extends BaseExpression<Boolean> {
    op: "or";
    // variadic
    args: Expression[];
}

export interface And extends BaseExpression<Boolean> {
    op: "and";
    // variadic
    args: Expression[];
}

// =====================
// Binary comparators
// =====================

export interface BaseCmp extends BaseExpression<Boolean> {
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
export interface BaseArithmeticOperation<T=Float | Integer> extends BaseExpression<T> {
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

export interface Div extends BaseArithmeticOperation<Float> {
    op: "div";
}

// =====================
// Array operations
// =====================
export interface ArrayOp<T> extends BaseExpression<T> {
    // Expression must be array-valued at runtime
    array: Expression;
}

export interface Slice extends ArrayOp<List> {
    op: "slice";
    start: Expression;
    end: Expression | null;
}

export interface Map extends ArrayOp<List> {
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

export interface Filter extends ArrayOp<List> {
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

export interface Fold extends ArrayOp<Value> {
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

export type Expression<V = Value> =
    // Root
    | Reg<V>
    | Local<V>
    | LastAction
    | GetListItem<V>
    | GetDictValue<V>
    | Lit<V>
    // Logic
    | If<V>
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
    | Slice<V>
    | Map<V>
    | Filter<V>
    | Fold<V>;