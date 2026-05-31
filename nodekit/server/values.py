"""Shared values for the NodeKit server/client API."""

import enum


# %% Runs
class RunStatus(str, enum.Enum):
    """Participant Run lifecycle states."""

    STARTED = "started"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    INVALID = "invalid"
