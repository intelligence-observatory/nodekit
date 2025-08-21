from typing import TypeVar

import pydantic


class DslModel(pydantic.BaseModel):
    pass


T = TypeVar('T', bound=DslModel)


class NullParameters(DslModel):
    """
    A sentinel model for *_parameter fields which do not require specification.
    """
    pass


class NullValue(DslModel):
    """
    A sentinel model for *_value fields which do not require specification.
    """
    pass


