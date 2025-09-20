import datetime
from decimal import Decimal
from typing import Literal, Annotated
from uuid import UUID

import pydantic


# %% Money
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


# %% Money
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

# %% Assets
SHA256 = Annotated[str, pydantic.Field(pattern=r'^[a-f0-9]{64}$')]

ImageMimeType = Literal[
    'image/png',
    'image/svg+xml'
]
VideoMimeType = Literal[
    'video/mp4'
]
MimeType = ImageMimeType | VideoMimeType

# %% Space
SpatialSize = Annotated[float, pydantic.Field(
    strict=True,
    ge=0,
    le=1,
    description='A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.'
)]
SpatialPoint = Annotated[float, pydantic.Field(strict=True, ge=-0.5, le=0.5)]

Mask = Annotated[
    Literal['rectangle', 'ellipse'],
    pydantic.Field(description='Describes the shape of a region inside of a bounding box. "rectangle" uses the box itself; "ellipse" inscribes a tighted fitted ellipse within the box.')
]
# %% Time
TimeDurationMsec = Annotated[int, pydantic.Field(strict=True, ge=0, description='A duration of time in milliseconds.')]
TimePointMsec = Annotated[int, pydantic.Field(strict=True, ge=0, description='A point in time relative to some start time in milliseconds.')]


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


# %% Text


MarkdownString = str

def _normalize_hex_code(value: str) -> str:
    if len(value) == 7:
        # If the hex code is in the format #RRGGBB, append 'FF' for full opacity
        value += 'FF'
    return value.lower()  # Lowercase

ColorHexString = Annotated[
    str,
    pydantic.BeforeValidator(
        _normalize_hex_code
    ),
    pydantic.Field(
        pattern=r"^#[0-9a-f]{8}$", # "#RRGGBBAA"
        min_length=9,
        max_length=9,
    )
]

# %% Keyboard
# Enter, spacebar, arrow keys, and alphanumeric keys:
PressableKey = Literal[
    'Enter',
    ' ',
    'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

# %% Identifiers
NodeId = UUID
SensorId = UUID
