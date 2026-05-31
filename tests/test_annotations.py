import datetime
from pathlib import Path
from typing import Any

import pydantic
import pytest

import nodekit as nk


# %%
def minimal_graph(annotation: Any = None) -> nk.Graph:
    return nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={
            "start": nk.transitions.End(),
        },
        annotation=annotation,
    )


@pytest.mark.parametrize(
    "annotation",
    [
        "label",
        123,
        1.5,
        True,
        False,
        None,
        ["practice", 4, None],
        {
            "trial": 4,
            "tags": ["practice"],
            "meta": {"difficulty": 0.7, "correct": True},
        },
    ],
)
def test_node_annotation_accepts_valid_json(annotation: nk.values.JsonValue) -> None:
    node = nk.Node(
        sensor=nk.sensors.WaitSensor(duration_msec=1),
        annotation=annotation,
    )

    assert node.annotation == annotation


def test_graph_annotation_roundtrips_structured_json() -> None:
    annotation = {
        "trial": 4,
        "tags": ["practice"],
        "meta": {"difficulty": 0.7, "correct": True},
    }

    graph = minimal_graph(annotation=annotation)
    roundtripped = nk.Graph.model_validate_json(graph.model_dump_json())

    assert roundtripped.annotation == annotation


@pytest.mark.parametrize(
    "annotation",
    [
        float("nan"),
        float("inf"),
        float("-inf"),
        {1: "not a JSON object key"},
        ("not", "a", "JSON", "array"),
        datetime.datetime(2026, 5, 30, tzinfo=datetime.UTC),
        Path("not-json"),
        b"not-json",
        object(),
    ],
)
def test_annotation_rejects_non_json_values(annotation: object) -> None:
    with pytest.raises(pydantic.ValidationError):
        nk.Node.model_validate(
            {
                "sensor": nk.sensors.WaitSensor(duration_msec=1).model_dump(mode="json"),
                "annotation": annotation,
            }
        )

    with pytest.raises(pydantic.ValidationError):
        minimal_graph(annotation=annotation)
