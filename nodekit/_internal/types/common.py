import datetime
from decimal import Decimal
from typing import Literal, Annotated
from uuid import UUID

import pydantic


# %%
def _ensure_monetary_amount_precision(value: str) -> str:
    SubcentMonetaryAmountAdapter = pydantic.TypeAdapter(
        Annotated[Decimal, pydantic.Field(decimal_places=5)]
    )
    d = SubcentMonetaryAmountAdapter.validate_python(value)
    return str(d)


MonetaryAmountUsd = Annotated[
    str,
    pydantic.Field(description='An arbitrary amount of money in USD, including negative amounts, represented as a string with at most five decimal places, e.g., "1.00001".'),
    pydantic.AfterValidator(_ensure_monetary_amount_precision)
]


# %%
def _ensure_payable_monetary_amount(value: str) -> str:
    PayableMonetaryAmountAdapter = pydantic.TypeAdapter(
        Annotated[Decimal, pydantic.Field(decimal_places=5)]
    )
    d = PayableMonetaryAmountAdapter.validate_python(value)
    return str(d)


PayableMonetaryAmountUsd = Annotated[
    str,
    pydantic.Field(description='A semi-positive amount of money in USD that is payable to a worker, represented as a string with at most two decimal places, e.g., "1.00". This amount must be at least "0.01".'),
    pydantic.AfterValidator(_ensure_payable_monetary_amount)
]


# %% Timestamps
def ensure_utc(t: datetime.datetime) -> datetime.datetime:
    # Ensures that a datetime is timezone-aware and in UTC.
    if t.tzinfo is None:
        raise ValueError(f"Datetime must be timezone-aware: {t}")
    return t.astimezone(datetime.timezone.utc)


DatetimeUTC = Annotated[
    datetime.datetime,
    pydantic.Field(description='A timezone-aware datetime in UTC.'),
    pydantic.AfterValidator(ensure_utc)
]

# %%
SHA256 = Annotated[str, pydantic.Field(pattern=r'^[a-f0-9]{64}$')]

MimeType = Literal[
    'image/png',
    'video/mp4'
    # Add other supported mime types here as needed
]
SpatialSize = Annotated[float, pydantic.Field(
    strict=True, ge=0, le=1, description='A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.'
)]
SpatialPoint = Annotated[float, pydantic.Field(strict=True, ge=-0.5, le=0.5)]
TimeDurationMsec = Annotated[int, pydantic.Field(strict=True, ge=0, description='A duration of time in milliseconds.')]
TimePointMsec = Annotated[int, pydantic.Field(strict=True, ge=0, description='A point in time relative to some start time in milliseconds.')]
CurrencyCode = Literal['USD']
MarkdownString = str
CardId = UUID
SensorId = UUID
NodeId = UUID
ColorHexString = Annotated[
    str,
    pydantic.Field(
        pattern=r'^#(?:[0-9a-fA-F]{3}){1,2}$',
        min_length=7,
        max_length=9,
    )
]


class TextContent(pydantic.BaseModel):
    text: MarkdownString
    text_color: ColorHexString = '#000000'
    font_size: SpatialSize = 0.0175
    justification_horizontal: Literal['left', 'center', 'right'] = 'left'
    justification_vertical: Literal['top', 'center', 'bottom'] = 'top'


class BoardRectangle(pydantic.BaseModel):
    """
    Describes a rectangle on the Board, in Board units.
    """
    width: SpatialSize
    height: SpatialSize


class BoardLocation(pydantic.BaseModel):
    """
    Describes the location of a point on the Board. The coordinates of that location are given under a
     coordinate system where:
    - (0,0) is the center of the Board.
    - A unit of 1 corresponds to the *smaller* extent of the Board (the full width of the Board or the full height of the Board; whichever is smaller.).
    - A positive increase in the x-dimension is rightwards.
    - A positive increase in the y-dimension is upwards.
    """
    x: SpatialPoint
    y: SpatialPoint


class Timespan(pydantic.BaseModel):
    start_time_msec: TimePointMsec = pydantic.Field(
        description="The start time of this Timespan relative to the NodePlay start, in milliseconds."
    )

    end_time_msec: TimePointMsec | None = pydantic.Field(
        description="The time, relative to NodePlay start, when the time span ends, in milliseconds. If None, the time span is open-ended and continues until the end of NodePlay.",
        default=None,
    )

    def check_if_subset_of_other(self, timespan_other: 'Timespan'):
        """
        Check if this Timespan is a subset of another Timespan.
        """
        if self.start_time_msec < timespan_other.start_time_msec:
            return False

        if self.end_time_msec is not None and timespan_other.end_time_msec is not None:
            if self.end_time_msec > timespan_other.end_time_msec:
                return False
        return True

    def is_finite(self) -> bool:
        """
        Check if the Timespan is finite (i.e., has a defined end time).
        """
        return self.end_time_msec is not None

# Enter, spacebar, arrow keys, and alphanumeric keys.

PressableKey = Literal[
    'Enter', ' ', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]
