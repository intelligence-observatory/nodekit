import pydantic

from nodekit._internal.types.common import ColorHexString


class Board(pydantic.BaseModel):
    board_width_px: int = pydantic.Field(default=768, gt=0)
    board_height_px: int = pydantic.Field(default=768, gt=0)
    background_color: ColorHexString = pydantic.Field(
        description='Hex string representing the background color of the Board.',
        default='#808080',
        validate_default=True,
    )
