import datetime
from decimal import Decimal
from typing import Literal, Annotated

import pydantic


# %%
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


# %%
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


# %% Timestamps
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

# %%
SHA256 = Annotated[str, pydantic.Field(pattern=r'^[a-f0-9]{64}$')]

MimeType = Literal[
    'image/png',
    # Add other supported mime types here as needed
]
