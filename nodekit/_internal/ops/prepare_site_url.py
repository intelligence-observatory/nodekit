"""Public helper for preparing NodeKit Site URLs."""

from typing import Literal
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


# %% Constants
Platform = Literal["none", "prolific", "mturk"]

NODEKIT_SUBMIT_TO_PARAM = "nodekitSubmitTo"
PROLIFIC_PARAMS = (
    "PROLIFIC_PID",
    "STUDY_ID",
    "SESSION_ID",
    "prolificCompletionCode",
)
MTURK_PARAMS = (
    "assignmentId",
    "hitId",
    "workerId",
    "turkSubmitTo",
)

PROLIFIC_PLACEHOLDERS = {
    "PROLIFIC_PID": "{{%PROLIFIC_PID%}}",
    "STUDY_ID": "{{%STUDY_ID%}}",
    "SESSION_ID": "{{%SESSION_ID%}}",
}


# %% Prepare Site URL
def prepare_site_url(
    site_url: str,
    platform: Platform = "none",
    nodekit_submit_to: str | None = None,
    prolific_completion_code: str | None = None,
) -> str:
    """Return a Site URL with NodeKit/platform query parameters prepared."""

    if platform not in ("none", "prolific", "mturk"):
        raise ValueError(f"Unsupported platform: {platform!r}.")

    if platform != "prolific" and prolific_completion_code is not None:
        raise ValueError("prolific_completion_code can only be used with platform='prolific'.")

    split_url = urlsplit(site_url)
    existing_query = parse_qsl(split_url.query, keep_blank_values=True)
    existing_nodekit_submit_to = _first_query_value(
        query=existing_query,
        key=NODEKIT_SUBMIT_TO_PARAM,
    )
    resolved_nodekit_submit_to = nodekit_submit_to or existing_nodekit_submit_to

    if platform == "prolific":
        if prolific_completion_code is None:
            raise ValueError("prolific_completion_code is required for platform='prolific'.")
        if resolved_nodekit_submit_to is None:
            raise ValueError("nodekit_submit_to is required for platform='prolific'.")

    stripped_query = _strip_owned_query_params(query=existing_query, platform=platform)
    prepared_query = list(stripped_query)

    if resolved_nodekit_submit_to is not None:
        prepared_query.append((NODEKIT_SUBMIT_TO_PARAM, resolved_nodekit_submit_to))

    if platform == "prolific":
        prepared_query.extend(PROLIFIC_PLACEHOLDERS.items())
        prepared_query.append(("prolificCompletionCode", prolific_completion_code or ""))

    return urlunsplit(
        (
            split_url.scheme,
            split_url.netloc,
            split_url.path,
            urlencode(prepared_query, doseq=True),
            split_url.fragment,
        )
    )


# %% Helpers
def _first_query_value(query: list[tuple[str, str]], key: str) -> str | None:
    for query_key, query_value in query:
        if query_key == key:
            return query_value
    return None


def _strip_owned_query_params(
    query: list[tuple[str, str]],
    platform: Platform,
) -> list[tuple[str, str]]:
    owned_params = {NODEKIT_SUBMIT_TO_PARAM}
    if platform == "prolific":
        owned_params.update(PROLIFIC_PARAMS)
        owned_params.update(MTURK_PARAMS)
    elif platform == "mturk":
        owned_params.update(PROLIFIC_PARAMS)
        owned_params.update(MTURK_PARAMS)
    return [(key, value) for key, value in query if key not in owned_params]
