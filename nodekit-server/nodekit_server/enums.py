"""Shared enums for the NodeKit deployment service."""

import enum


# %% Runs
class RunStatus(str, enum.Enum):
    """Participant Run lifecycle states."""

    STARTED = "started"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    INVALID = "invalid"


# %% Exports
class ExportFormat(str, enum.Enum):
    """Supported Run export formats."""

    JSONL = "jsonl"
    CSV = "csv"
