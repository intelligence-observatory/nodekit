import type {Boolean, String, Dict, Float, Integer, List, RegisterId, Value} from "../value.ts";
import type {Action} from "../actions";

export type LocalVariableName = String;
type Numeric = Integer | Float;
type Comparable = Numeric | String;

export interface BaseExpression<V=Value> {
    op: string;
    __result?: V
}

// =====================
// Root expressions
// =====================
export interface Reg<V extends Value = Value> extends BaseExpression<V> {
    /**
     * Evaluates to the value stored in the specified Graph Register.
     */
    op: "reg";
    id: RegisterId;
}

export interface Local<V extends Value = Value> extends BaseExpression<V> {
    /**
     * Evaluates to the value of the specified Local Variable.
     */
    op: "loc";
    name: LocalVariableName;
}

export interface LastAction extends BaseExpression<Action> {
    /**
     * Evaluates to the last completed Node's Action.
     */
    op: "la"
}

export interface GetListItem<V extends Value = Value> extends BaseExpression<V> {
    /**
     * Get an item from a List.
     */
    op: "gli";
    list: Expression<List>;
    index: Expression<Integer>;
}
export interface GetDictValue<V extends Value = Value> extends BaseExpression<V> {
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
    operand: Expression<Boolean>;
}

export interface Or extends BaseExpression<Boolean> {
    op: "or";
    // variadic
    args: Expression<Boolean>[];
}

export interface And extends BaseExpression<Boolean> {
    op: "and";
    // variadic
    args: Expression<Boolean>[];
}

// =====================
// Binary comparators
// =====================

export interface BaseCmp extends BaseExpression<Boolean> {
    lhs: Expression<Comparable>;
    rhs: Expression<Comparable>;
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
export interface BaseArithmeticOperation<T extends Numeric = Numeric> extends BaseExpression<T> {
    lhs: Expression<Numeric>;
    rhs: Expression<Numeric>;
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
export interface ListOp<V extends Value = Value> extends BaseExpression<V> {
    // Expression must be array-valued at runtime
    array: Expression<List>;
}

export interface Slice extends ListOp<List> {
    op: "slice";
    start: Expression<Integer>;
    end: Expression<Integer> | null;
}

export interface Map extends ListOp<List> {
    op: "map";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array.
     */
    func: Expression<Value>;
}

export interface Filter extends ListOp<List> {
    op: "filter";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array
     * and interpreted as a predicate.
     */
    predicate: Expression<Boolean>;
}

export interface Fold<V extends Value = Value> extends ListOp<V> {
    op: "fold";
    init: Expression<V>;
    /**
     * The variable name the cumulant will be assigned to. Can be referenced in the func: Expression with Var(...).
     */
    acc: LocalVariableName;
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    func: Expression<V>;
}

export type AnyExpression =
    // Root
    | Reg
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
    | Slice
    | Map
    | Filter
    | Fold

export type Expression<V = Value> = Extract<AnyExpression, {__result?: V}>
