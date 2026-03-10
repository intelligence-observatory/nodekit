# %%
from packaging.version import InvalidVersion, Version


# %%
VERSION = "0.2.6.dev1"


# %%
def validate_compatible_nodekit_version(value: str) -> str:
    """Accept NodeKit versions on the same major release line that are not newer than runtime.

    This allows older serialized Graphs and Traces from the current major series to load,
    while rejecting cross-major formats and artifacts produced by a newer runtime.
    """
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
