import pydantic

class Board(pydantic.BaseModel):
    width_px: int = pydantic.Field(gt=0, description="Width of the Board")
    height_px: int = pydantic.Field(gt=0, description="Height of the Board")
