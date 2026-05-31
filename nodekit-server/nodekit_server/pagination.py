"""Pagination contracts for the NodeKit deployment service."""

from typing import Generic, TypeVar

import pydantic


PageItemT = TypeVar("PageItemT", bound=pydantic.BaseModel)


# %% PageResponse
class PageResponse(pydantic.BaseModel, Generic[PageItemT]):
    items: list[PageItemT]
    next_page_cursor: str | None = pydantic.Field(
        default=None,
        description="The cursor for the next page.",
    )


# %% PageQuery
class PageQuery(pydantic.BaseModel):
    max_items: int = pydantic.Field(
        default=100,
        ge=1,
        le=100,
        description="The number of items per page.",
    )
    page_cursor: str | None = pydantic.Field(
        default=None,
        description="The cursor for the requested page. If None, the first page is returned.",
    )
