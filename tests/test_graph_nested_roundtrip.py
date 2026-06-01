import nodekit as nk


# %%
def _minimal_graph() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={
            "start": nk.transitions.End(),
        },
        start="start",
    )


def test_graph_with_nested_graph_roundtrips_from_json() -> None:
    child_graph = _minimal_graph()
    parent_graph = nk.Graph(
        nodes={
            "child": child_graph,
            "done": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={
            "child": nk.transitions.Go(to="done"),
            "done": nk.transitions.End(),
        },
        start="child",
    )

    restored = nk.Graph.model_validate_json(parent_graph.model_dump_json())

    assert isinstance(restored.nodes["child"], nk.Graph)
    assert isinstance(restored.nodes["done"], nk.Node)
