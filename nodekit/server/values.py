"""Shared values for the NodeKit server/client API."""

import enum
from typing import TypeAlias
from uuid import UUID


# %% Identifiers
ApiTokenId: TypeAlias = UUID
RunId: TypeAlias = UUID
SiteId: TypeAlias = UUID
TagId: TypeAlias = UUID
UserId: TypeAlias = UUID


# %% Runs
class RunStatus(str, enum.Enum):
    """Participant Run lifecycle states."""

    STARTED = "started"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    INVALID = "invalid"
