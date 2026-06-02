import math
from typing import Any, Literal, Annotated

import pydantic

# %% Base Values

type Platform = Literal["MechanicalTurk", "MechanicalTurkSandbox", "Prolific", "NoPlatform"]
type List = list["Value"]
type Dict = dict[str, "Value"]
type LeafValue = bool | int | float | str
type Value = LeafValue | List | Dict | None


def _validate_json_value(value: Any) -> Any:
    if value is None or isinstance(value, (bool, int, str)):
        return value

    if isinstance(value, float):
        if not math.isfinite(value):
            raise ValueError("JSON numbers must be finite.")
        return value

    if isinstance(value, list):
        for item in value:
            _validate_json_value(item)
        return value

    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ValueError("JSON object keys must be strings.")
            _validate_json_value(item)
        return value

    raise ValueError(f"Value must be valid JSON, got {type(value).__name__}.")


type JsonValue = Annotated[
    pydantic.JsonValue,
    pydantic.BeforeValidator(_validate_json_value),
]


# %% Spatial
type PixelSize = Annotated[
    int,
    pydantic.Field(
        strict=True,
        ge=0,
        description=("A spatial size in units of W3C reference pixels. "),
    ),
]

type PixelPoint = Annotated[
    int,
    pydantic.Field(
        strict=True,
        description=(
            "A spatial location relative to some origin, in units of W3C reference pixels."
        ),
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
    ),
]
# %% Text
type MarkdownString = Annotated[
    str, pydantic.Field(strict=True, description="Markdown-formatted string")
]


def _normalize_hex_code(value: str) -> str:
    if len(value) == 7:
        # If the hex code is in the format #RRGGBB, append 'FF' for full opacity
        value += "FF"
    return value.lower()  # Lowercase


type ColorHexString = Annotated[
    str,
    pydantic.BeforeValidator(_normalize_hex_code),
    pydantic.Field(
        pattern=r"^#[0-9a-fA-F]{8}$",  # "#RRGGBBAA"
        min_length=9,
        max_length=9,
    ),
]

# %% Keyboard
type PressableKey = Literal[
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
    "Enter",
    " ",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
]

# %% Assets
type SHA256 = Annotated[str, pydantic.Field(pattern=r"^[a-f0-9]{64}$")]
"""A hex string representing a SHA-256 hash.
"""

type ImageMediaType = Literal["image/png", "image/svg+xml", "image/jpeg"]
type VideoMediaType = Literal["video/mp4"]
type MediaType = ImageMediaType | VideoMediaType


# %% Identifiers
type NodeId = Annotated[
    str,
    pydantic.Field(
        description="An identifier for a Node which is unique within a Graph.",
    ),
]

type NodeAddress = Annotated[
    list[NodeId],
    pydantic.Field(
        description="The address of a Node within a Graph.",
    ),
]

type GraphAddress = NodeAddress

type RegisterId = Annotated[str, pydantic.Field(description="An identifier for a Graph register.")]


class Region(pydantic.BaseModel):
    x: PixelPoint
    y: PixelPoint
    w: PixelSize
    h: PixelSize
    z_index: int | None = None
    mask: Annotated[
        Literal["ellipse", "rectangle"],
        pydantic.Field(
            description='Describes the shape of a region inside of a bounding box. "rectangle" uses the box itself; "ellipse" inscribes a tightly fitted ellipse within the box.'
        ),
    ] = "rectangle"
