# %%
from packaging.version import InvalidVersion, Version


# %%
VERSION = "0.2.6"


# %%
def validate_compatible_nodekit_version(value: str) -> str:
    try:
        got = Version(value)
        current = Version(VERSION)
    except InvalidVersion as exc:
        raise ValueError(f"Invalid NodeKit version: {value}") from exc

    if got.major != current.major:
        raise ValueError(
            f"Incompatible NodeKit major version: expected {current.major}.x, got {value}"
        )

    if got > current:
        raise ValueError(
            f"Serialized NodeKit version {value} is newer than runtime version {VERSION}"
        )

    return value
