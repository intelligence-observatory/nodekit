import pytest
import nodekit as nk

# %% Helper functions
def get_fixation_node() -> nk.Node:
    click_sensor = nk.sensors.ClickSensor(
        mask="ellipse",
        x=0,
        y=0,
        w=0.05,
        h=0.05,
    )
    return nk.Node(cards={}, sensors={"fixation": click_sensor})


def get_stimulus_node():
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(cards={}, sensors={"TO": timeout_sensor})


def get_response_node():
    left_sensor = nk.sensors.ClickSensor(mask="rectangle", x=-0.5, y=0, w=0.1, h=0.1)
    right_sensor = nk.sensors.ClickSensor(mask="rectangle", x=0.5, y=0, w=0.1, h=0.1)
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(
        cards={},
        sensors={
            "left": left_sensor,
            "right": right_sensor,
            "TO": timeout_sensor,
        },
    )


def get_positive_node():
    return nk.Node(
        cards={},
        sensors={"wait": nk.sensors.TimeoutSensor(timeout_msec=1000)},
    )


def get_negative_node():
    return nk.Node(
        cards={},
        sensors={"wait": nk.sensors.TimeoutSensor(timeout_msec=5000)},
    )



def test_example_pass():
    # Example 1:
    # Visual structure:
    #          n[f1]
    #            -
    #          n[s1]
    #            -
    #          n[r1]
    #          /   \
    #       n[p1] n[n1]
    #          -   -
    #          n[f2]
    #            -
    #          n[s2]
    # s: stimulus, f:fixation, p:positive, n:negative, r: response:

    # Random correct answer:
    correct = ["left"]

    # Generate Nodes and transitions:
    nodes = {}
    nodes["response_1"] = get_response_node()
    nodes["negative_1"] = get_negative_node()
    nodes["positive_1"] = get_positive_node()


    transitions = {}
    transitions["response_1"] = {
        "left": "positive_1" if correct[0] == "left" else "negative_1",
        "right": "positive_1" if correct[0] == "right" else "negative_1",
    }

    response = nk.Graph(
        nodes=nodes, start="response_1", 
        transitions=transitions,
        )

    fix_1 = get_fixation_node()
    stim_1 = get_stimulus_node()
    fix_2 = get_fixation_node()
    stim_2 = get_stimulus_node()

    ids = ['fixation_1', 'stimulus_1', 'trial_1', 'fixation_2', 'stimulus_2']
    graph = nk.concat(
        [fix_1, stim_1, response, fix_2, stim_2],
        ids=ids
        )

    # Check basic Graph properties:
    assert isinstance(graph, nk.Graph)
    assert graph.start == "fixation_1", "Start node should match the first element’s id"

    # Check all nodes are present with correct namespacing:
    assert set(graph.nodes.keys()) == {
        "fixation_1",
        "stimulus_1",
        "trial_1/response_1",
        "trial_1/positive_1",
        "trial_1/negative_1",
        "fixation_2",
        "stimulus_2",
    }, "All nodes should be present with correct namespacing"

    # Check full connection in all elements of sequence except the last:
    for i in range(len(ids) - 1):
        prefix = ids[i]

        # Check all sensors in the node are in transitions:
        for node_id, node in graph.nodes.items():
            if node_id == prefix or node_id.startswith(f"{prefix}/"):
                sensors = set(node.sensors.keys())
                outgoing = set(graph.transitions.get(node_id, {}).keys())

                missing = sensors - outgoing
                assert not missing, (
                    f"Node {node_id} has unconnected sensors: {missing}"
                )


def test_concat_invalid_element():
    fix = nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})
    stim = nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})
    bad_item = "not_a_graph"

    with pytest.raises(TypeError, match="must be `Node` or `Graph`"):
        nk.concat([fix, stim, bad_item])


def test_concat_duplicate_ids():
    fix = nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})
    stim = nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})

    with pytest.raises(ValueError, match="must be unique"):
        nk.concat([fix, stim], ids=["same", "same"])


def test_concat_preserves_internal_edges():
    node_a = nk.Node(cards={}, sensors={"x": nk.sensors.TimeoutSensor(timeout_msec=1)})
    node_b = nk.Node(cards={}, sensors={"y": nk.sensors.TimeoutSensor(timeout_msec=1)})

    g = nk.Graph(nodes={"A": node_a, "B": node_b}, start="A", transitions={"A": {"x": "B"}})

    extra = nk.Node(cards={}, sensors={"z": nk.sensors.TimeoutSensor(timeout_msec=1)})

    result = nk.concat([g, extra], ids=["trial", "next"])
    transitions = result.transitions

    # Internal transition still present
    assert "trial/A" in transitions and "x" in transitions["trial/A"]
