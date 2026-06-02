import base64
import gzip
from typing import Any
from urllib.parse import parse_qs, urlparse

from fastapi.testclient import TestClient

import nodekit as nk
from nodekit._internal.ops.build_site.types import NoPlatformContext
from nodekit._internal.types.assets import FileSystemPath
from nodekit._internal.utils.iter_assets import iter_assets
from nodekit.server.values import RunStatus


# %%
def _upload_graph_assets(client: TestClient, graph: nk.Graph) -> None:
    for asset in iter_assets(graph=graph):
        assert isinstance(asset.locator, FileSystemPath)
        asset_path = asset.locator.path
        client.post(
            "/assets",
            data={
                "sha256": asset.sha256,
                "media_type": asset.media_type,
            },
            files={
                "file": (
                    asset_path.name,
                    asset_path.read_bytes(),
                    asset.media_type,
                )
            },
        ).raise_for_status()


def _make_site_submission(graph: nk.Graph) -> nk.SiteSubmission:
    trace = nk.Trace(
        graph=graph,
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.ActionTakenEvent(
                t=2,
                node_address=["start"],
                action=nk.actions.WaitAction(),
            ),
            nk.events.NodeEndedEvent(t=3, node_address=["start"]),
            nk.events.TraceEndedEvent(t=4),
        ],
    )
    trace_json_gzip = gzip.compress(trace.model_dump_json().encode("utf-8"), mtime=0)
    return nk.SiteSubmission(
        trace_gzipped_base64=base64.b64encode(trace_json_gzip).decode("ascii"),
        platform_context=NoPlatformContext(platform="NoPlatform"),
    )


def _create_researcher(authenticated_client: TestClient) -> tuple[dict[str, Any], str]:
    user_response = authenticated_client.post(
        "/admin/users",
        json={
            "username": "e2e-researcher",
            "is_admin": False,
        },
    )
    user_response.raise_for_status()
    user = user_response.json()

    token_response = authenticated_client.post(
        "/admin/api-tokens",
        json={
            "name": "e2e-token",
            "user_id": user["user_id"],
        },
    )
    token_response.raise_for_status()
    return user, token_response.json()["token"]


# %%
def test_server_e2e_site_submission_flow(
    authenticated_client: TestClient,
    server_main: Any,
    graph_with_assets: nk.Graph,
) -> None:
    _, token = _create_researcher(authenticated_client)

    with TestClient(server_main.app) as researcher_client:
        researcher_client.headers.update({"Authorization": f"Bearer {token}"})
        _upload_graph_assets(researcher_client, graph_with_assets)

        create_site_response = researcher_client.post(
            "/sites",
            json={
                "graph": graph_with_assets.model_dump(mode="json"),
                "tags": ["e2e"],
            },
        )
        create_site_response.raise_for_status()
        site = create_site_response.json()

    assert set(site) == {"site_id", "url"}

    with TestClient(server_main.app) as participant_client:
        site_response = participant_client.get(
            f"/s/{site['site_id']}",
            follow_redirects=False,
        )
        assert site_response.status_code == 307
        participant_query = parse_qs(urlparse(site_response.headers["location"]).query)
        [nodekit_participant_id] = participant_query["nodekitParticipantId"]

        artifact_response = participant_client.get(
            f"/s/{site['site_id']}",
            params=[("nodekitParticipantId", nodekit_participant_id)],
            follow_redirects=False,
        )
        assert artifact_response.status_code == 307
        location = artifact_response.headers["location"]
        query = parse_qs(urlparse(location).query)
        assert query["nodekitParticipantId"] == [nodekit_participant_id]
        [submit_url] = query["nodekitSubmitTo"]
        assert urlparse(submit_url).path.startswith(f"/s/{site['site_id']}/runs/")

        html_response = participant_client.get(location)
        assert html_response.status_code == 200
        assert "NodeKit.play(graph)" in html_response.text

        site_submission = _make_site_submission(graph_with_assets)
        submit_response = participant_client.post(
            urlparse(submit_url).path,
            json=site_submission.model_dump(mode="json"),
        )
        submit_response.raise_for_status()
        submitted_run = submit_response.json()

    assert submitted_run["site_id"] == site["site_id"]
    assert submitted_run["status"] == RunStatus.SUBMITTED.value

    with TestClient(server_main.app) as researcher_client:
        researcher_client.headers.update({"Authorization": f"Bearer {token}"})
        get_run_response = researcher_client.get(f"/runs/{submitted_run['run_id']}")
        get_run_response.raise_for_status()
        run = get_run_response.json()

    assert run["site_id"] == site["site_id"]
    returned_submission = nk.SiteSubmission.model_validate_json(
        gzip.decompress(base64.b64decode(run["site_submission_json_gzip"])).decode("utf-8")
    )
    assert returned_submission == site_submission
