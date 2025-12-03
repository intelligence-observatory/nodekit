from typing import Literal, Annotated

import pydantic

# %% Spatial
type SpatialSize = Annotated[
    float,
    pydantic.Field(
        strict=True,
        ge=0,
        le=1,
        description="A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.",
    ),
]

type SpatialPoint = Annotated[float, pydantic.Field(strict=True, ge=-0.5, le=0.5)]

Mask = Annotated[
    Literal["ellipse", "rectangle"],
    pydantic.Field(
        description='Describes the shape of a region inside of a bounding box. "rectangle" uses the box itself; "ellipse" inscribes a tightly fitted ellipse within the box.'
    ),
]

# %% Time
type TimeElapsedMsec = Annotated[
    int,
    pydantic.Field(
        strict=True,
        description="A time point, relative to some origin.",
    ),
]

type TimeDurationMsec = Annotated[
    int,
    pydantic.Field(
        strict=True,
        ge=0,
        description="A duration of time in milliseconds, relative to the start of the Trace.",
    )
]
# %% Text
type MarkdownString = Annotated[str, pydantic.Field(strict=True, description='Markdown-formatted string')]


def _normalize_hex_code(value: str) -> str:
    if len(value) == 7:
        # If the hex code is in the format #RRGGBB, append 'FF' for full opacity
        value += "FF"
    return value.lower()  # Lowercase


type ColorHexString = Annotated[
    str,
    pydantic.BeforeValidator(_normalize_hex_code),
    pydantic.Field(
        pattern=r"^#[0-9a-f]{8}$",  # "#RRGGBBAA"
        min_length=9,
        max_length=9,
    ),
]

# %% Keyboard
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

# %% Assets
SHA256 = Annotated[str, pydantic.Field(pattern=r"^[a-f0-9]{64}$")]
type ImageMediaType = Literal["image/png", "image/svg+xml"]
type VideoMediaType = Literal["video/mp4"]
type MediaType = ImageMediaType | VideoMediaType


# %% Identifiers
type NodeId = Annotated[
    str,
    pydantic.Field(
        description="An identifier for a Node which is unique within a Graph.",
    ),
]

type RegisterId = Annotated[
    str,
    pydantic.Field(
        description='An identifier for a Graph register.'
    )
]