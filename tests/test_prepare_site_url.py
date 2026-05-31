from urllib.parse import parse_qs, urlparse

import pytest

import nodekit as nk


# %% Helpers
def _query(url: str) -> dict[str, list[str]]:
    return parse_qs(urlparse(url).query, keep_blank_values=True)


# %% Tests
def test_prepare_site_url_preserves_unrelated_query_params() -> None:
    url = nk.prepare_site_url(
        site_url="https://nodekit.example/task?batch=one&batch=two&source=email",
        nodekit_submit_to="https://nodekit.example/task/submit",
    )

    query = _query(url)
    assert query["batch"] == ["one", "two"]
    assert query["source"] == ["email"]
    assert query["nodekitSubmitTo"] == ["https://nodekit.example/task/submit"]


def test_prepare_site_url_updates_existing_nodekit_submit_to() -> None:
    url = nk.prepare_site_url(
        site_url="https://nodekit.example/task?nodekitSubmitTo=https%3A%2F%2Fold.example",
        nodekit_submit_to="https://new.example/submit",
    )

    assert _query(url)["nodekitSubmitTo"] == ["https://new.example/submit"]


def test_prepare_site_url_without_submit_url_leaves_nodekit_submit_to_absent() -> None:
    url = nk.prepare_site_url(site_url="https://nodekit.example/task?cohort=a")

    query = _query(url)
    assert query["cohort"] == ["a"]
    assert "nodekitSubmitTo" not in query


def test_prepare_site_url_prepares_prolific_url() -> None:
    url = nk.prepare_site_url(
        site_url="https://nodekit.example/static-task?cohort=a",
        platform="prolific",
        nodekit_submit_to="https://nodekit.example/static-task/submit",
        prolific_completion_code="complete-123",
    )

    query = _query(url)
    assert query["cohort"] == ["a"]
    assert query["nodekitSubmitTo"] == ["https://nodekit.example/static-task/submit"]
    assert query["PROLIFIC_PID"] == ["{{%PROLIFIC_PID%}}"]
    assert query["STUDY_ID"] == ["{{%STUDY_ID%}}"]
    assert query["SESSION_ID"] == ["{{%SESSION_ID%}}"]
    assert query["prolificCompletionCode"] == ["complete-123"]


def test_prepare_site_url_uses_existing_submit_url_for_prolific() -> None:
    url = nk.prepare_site_url(
        site_url="https://nodekit.example/task?nodekitSubmitTo=https%3A%2F%2Fnodekit.example%2Fsubmit",
        platform="prolific",
        prolific_completion_code="complete-123",
    )

    assert _query(url)["nodekitSubmitTo"] == ["https://nodekit.example/submit"]


def test_prepare_site_url_rejects_prolific_without_submit_url() -> None:
    with pytest.raises(ValueError, match="nodekit_submit_to is required"):
        nk.prepare_site_url(
            site_url="https://nodekit.example/static-task",
            platform="prolific",
            prolific_completion_code="complete-123",
        )


def test_prepare_site_url_rejects_prolific_without_completion_code() -> None:
    with pytest.raises(ValueError, match="prolific_completion_code is required"):
        nk.prepare_site_url(
            site_url="https://nodekit.example/static-task",
            platform="prolific",
            nodekit_submit_to="https://nodekit.example/static-task/submit",
        )


def test_prepare_site_url_prepares_mturk_without_runtime_params() -> None:
    url = nk.prepare_site_url(
        site_url=(
            "https://nodekit.example/task?"
            "PROLIFIC_PID=old&assignmentId=old&hitId=old&workerId=old&turkSubmitTo=old"
        ),
        platform="mturk",
        nodekit_submit_to="https://nodekit.example/task/submit",
    )

    query = _query(url)
    assert query["nodekitSubmitTo"] == ["https://nodekit.example/task/submit"]
    assert "PROLIFIC_PID" not in query
    assert "assignmentId" not in query
    assert "hitId" not in query
    assert "workerId" not in query
    assert "turkSubmitTo" not in query


def test_prepare_site_url_rejects_prolific_completion_code_for_mturk() -> None:
    with pytest.raises(ValueError, match="prolific_completion_code can only be used"):
        nk.prepare_site_url(
            site_url="https://nodekit.example/task",
            platform="mturk",
            prolific_completion_code="complete-123",
        )


def test_prepare_site_url_preserves_platform_params_for_none_platform() -> None:
    url = nk.prepare_site_url(
        site_url=(
            "https://nodekit.example/task?"
            "PROLIFIC_PID=participant-1&STUDY_ID=study-1&assignmentId=assignment-1"
        ),
        platform="none",
        nodekit_submit_to="https://nodekit.example/task/submit",
    )

    query = _query(url)
    assert query["PROLIFIC_PID"] == ["participant-1"]
    assert query["STUDY_ID"] == ["study-1"]
    assert query["assignmentId"] == ["assignment-1"]
    assert query["nodekitSubmitTo"] == ["https://nodekit.example/task/submit"]
