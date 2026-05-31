from pathlib import Path

import pytest

import nodekit as nk
from nodekit._internal.ops.transform_asset_locators import transform_asset_locators
from nodekit._internal.types.assets import FileSystemPath, URL
from nodekit._internal.utils.iter_assets import iter_assets


ASSET_DIR = Path(__file__).parent / "assets"


# %%
def _make_nested_asset_graph() -> nk.Graph:
    png_asset = nk.assets.Image.from_path(
        ASSET_DIR / "629cd38bb1526395e0a01e0eb6985b973ea1077b170911f221b1b84c9d3446d8.png"
    )
    svg_asset = nk.assets.Image.from_path(ASSET_DIR / "fixation-cross.svg")
    video_asset = nk.assets.Video.from_path(ASSET_DIR / "test-video.mp4")

    nested_graph = nk.Graph(
        nodes={
            "inner": nk.Node(
                card=nk.cards.ImageCard(image=png_asset),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={"inner": nk.transitions.End()},
        start="inner",
    )

    return nk.Graph(
        nodes={
            "start": nk.Node(
                card=nk.cards.CompositeCard(
                    children={
                        "image": nk.cards.ImageCard(image=png_asset),
                        "video": nk.cards.VideoCard(video=video_asset),
                    }
                ),
                sensor=nk.sensors.ProductSensor(
                    children={
                        "sum": nk.sensors.SumSensor(
                            children={
                                "select": nk.sensors.SelectSensor(
                                    choices={
                                        "choice": nk.cards.ImageCard(image=svg_asset),
                                    }
                                ),
                                "multi": nk.sensors.MultiSelectSensor(
                                    choices={
                                        "other": nk.cards.ImageCard(image=png_asset),
                                    },
                                    min_selections=1,
                                    max_selections=1,
                                    confirm_button=nk.cards.TextCard(text="confirm"),
                                ),
                            }
                        )
                    }
                ),
            ),
            "nested": nested_graph,
        },
        transitions={
            "start": nk.transitions.Go(to="nested"),
            "nested": nk.transitions.End(),
        },
        start="start",
    )


# %%
def test_transform_asset_locators_returns_copy_without_mutating_original() -> None:
    graph = _make_nested_asset_graph()

    transformed = transform_asset_locators(
        graph=graph,
        transform=lambda asset: URL(url=f"/assets/{asset.sha256}"),
    )

    assert transformed is not graph
    assert [asset.sha256 for asset in iter_assets(transformed)] == [
        asset.sha256 for asset in iter_assets(graph)
    ]

    for asset in iter_assets(graph):
        assert isinstance(asset.locator, FileSystemPath)

    for asset in iter_assets(transformed):
        assert isinstance(asset.locator, URL)
        assert asset.locator.url == f"/assets/{asset.sha256}"


# %%
def test_transform_asset_locators_passes_callback_a_copy() -> None:
    graph = _make_nested_asset_graph()

    def mutate_callback_asset(asset: nk.assets.Asset) -> URL:
        asset.locator = URL(url="callback-mutation")
        return URL(url=f"/returned/{asset.sha256}")

    transformed = transform_asset_locators(
        graph=graph,
        transform=mutate_callback_asset,
    )

    for asset in iter_assets(graph):
        assert isinstance(asset.locator, FileSystemPath)

    for asset in iter_assets(transformed):
        assert isinstance(asset.locator, URL)
        assert asset.locator.url.startswith("/returned/")


# %%
def test_transform_asset_locators_rejects_non_locator() -> None:
    graph = _make_nested_asset_graph()

    with pytest.raises(TypeError, match="must return an AssetLocator"):
        transform_asset_locators(
            graph=graph,
            transform=lambda asset: "not a locator",  # type: ignore[return-value]
        )
