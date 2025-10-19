import pydantic


# %% Value: data structures typed as Value[V], which represent a value of type V

"""
Value types: 
"""


# %% Expressions: data structures typed as Expression[V], which evaluate to a Value of type V

# Predicates as Expression[bool]

"""
Operators 
"""

# %%


# %% Expressions.
# Expression[T] evaluates to a value of type T
# Should use AST JSON for this.
"""
We have constants (e.g. true, false, 3, "hello", "#FF0000", 42, 3.14)
We have register references (e.g. StimulusImage.visible, StimulusSlider.bin_index)
We have the current input event
We have operators (e.g. +, -, *, /, AND, OR, NOT, ==, !=, <, <=, >, >=) which take one or two arguments and return a value
We have parentheses for grouping (e.g ( ... ) )

These evaluate to *values*, including structs.
"""
class Expression(pydantic.BaseModel):
    pass

class Value(pydantic.BaseModel):
    """
    The result of evaluating an Expression.
    """
    ...

# %% Predicates. e.g. P = (StimulusImage.visible == true AND StimulusSlider.bin_index == 3)
# Predicates are Expression[bool]

"""
These operate on expressions (see above) and return a boolean value.

Operators: 
AND, OR, NOT
"""
class Predicate(pydantic.BaseModel):
    pass
