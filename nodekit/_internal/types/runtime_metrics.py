import pydantic

from nodekit._internal.types.base import DslModel


# %% Measurements
class PixelArea(DslModel):
    width_px: int = pydantic.Field(description="Width of the area in pixels.", ge=0)
    height_px: int = pydantic.Field(description="Height of the area in pixels.", ge=0)


class RuntimeMetrics(DslModel):
    model_config = pydantic.ConfigDict(
        extra='allow',
        frozen=True,
    )

    # Board
    display_area: PixelArea = pydantic.Field(description="Metrics of the display area in which the board is rendered.")
    viewport_area: PixelArea = pydantic.Field(description="Metrics of the viewport in which the board is rendered.")
    board_area: PixelArea = pydantic.Field(description="Metrics of the board area in which the cards are rendered.")

    # User agent string
    user_agent: str = pydantic.Field(description="User agent string of the browser or application rendering the board.")
