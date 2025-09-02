import pydantic


class DslModel(pydantic.BaseModel):
    pass



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


