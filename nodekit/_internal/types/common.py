from typing import Literal, Annotated

import pydantic

# %% Assets
SHA256 = Annotated[str, pydantic.Field(pattern=r"^[a-f0-9]{64}$")]

ImageMimeType = Literal["image/png", "image/svg+xml"]
VideoMimeType = Literal["video/mp4"]
MimeType = ImageMimeType | VideoMimeType

# %% Space
SpatialSize = Annotated[
    float,
    pydantic.Field(
        strict=True,
        ge=0,
        le=1,
        description="A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.",
    ),
]
SpatialPoint = Annotated[float, pydantic.Field(strict=True, ge=-0.5, le=0.5)]

Mask = Annotated[
    Literal["rectangle", "ellipse"],
    pydantic.Field(
        description='Describes the shape of a region inside of a bounding box. "rectangle" uses the box itself; "ellipse" inscribes a tightly fitted ellipse within the box.'
    ),
]
# %% Time
NodeTimePointMsec = Annotated[
    int,
    pydantic.Field(
        strict=True,
        ge=0,
        description="A point in time relative to the start of a Node.",
    ),
]
TimeElapsedMsec = Annotated[
    int,
    pydantic.Field(
        strict=True,
        ge=0,
        description="An elapsed duration of time in milliseconds, relative to the start of the Trace.",
    ),
]

# %% Text
MarkdownString = str


def _normalize_hex_code(value: str) -> str:
    if len(value) == 7:
        # If the hex code is in the format #RRGGBB, append 'FF' for full opacity
        value += "FF"
    return value.lower()  # Lowercase


ColorHexString = Annotated[
    str,
    pydantic.BeforeValidator(_normalize_hex_code),
    pydantic.Field(
        pattern=r"^#[0-9a-f]{8}$",  # "#RRGGBBAA"
        min_length=9,
        max_length=9,
    ),
]

# %% Keyboard
# Enter, spacebar, arrow keys, and alphanumeric keys:
PressableKey = Literal[
    "Enter",
    " ",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
]

# %% Identifiers
NodeId = Annotated[
    str,
    pydantic.Field(
        description="An identifier for a Node which is unique within a Graph.",
    ),
]

SensorId = Annotated[
    str,
    pydantic.Field(
        description="An identifier for a Sensor which is unique within a Node.",
    ),
]

# %% Money
AmountUsdStr = Annotated[
    str,
    pydantic.Field(
        pattern=r"^-?\d+(\.\d{1,5})?$",
        description="A decimal number with at most five decimal places, representing an amount in USD (negative or positive). ",
    ),
]
