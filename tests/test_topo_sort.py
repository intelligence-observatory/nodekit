import pytest

import nodekit as nk
import nodekit._internal.ops.topological_sorting as ts


# %% Helper functions
def generate_fixation_node() -> nk.Node:
    click_sensor = nk.sensors.ClickSensor(
        mask="ellipse",
        x=0,
        y=0,
        w=0.05,
        h=0.05,
    )
    return nk.Node(cards={}, sensors={"fixation": click_sensor})


def generate_stimulus_node():
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(cards={}, sensors={"TO": timeout_sensor})


def generate_response_node():
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


def generate_positive_node():
    return nk.Node(
        cards={},
        sensors={"wait": nk.sensors.TimeoutSensor(timeout_msec=1000)},
    )


def generate_negative_node():
    return nk.Node(
        cards={},
        sensors={"wait": nk.sensors.TimeoutSensor(timeout_msec=5000)},
    )


# %% Topology tests:


def test_example_pass():
    # Example 1:
    # Visual structure:
    #          n[f1]
    #            |
    #          n[s1]
    #            |
    #          n[r1]
    #          /   \
    #       n[p1] n[n1]
    #          \   /
    #          n[f2]
    #            |
    #          n[s2]
    # s: stimulus, f:fixation, p:positive, n:negative, r: response:

    # Random correct answer:
    correct = ["left"]

    # Generate Nodes and transitions:
    nodes = {}
    nodes["stimulus_1"] = generate_stimulus_node()
    nodes["stimulus_2"] = generate_stimulus_node()
    nodes["response_1"] = generate_response_node()
    nodes["fixation_1"] = generate_fixation_node()
    nodes["fixation_2"] = generate_fixation_node()
    nodes["positive_1"] = generate_positive_node()
    nodes["negative_1"] = generate_negative_node()

    transitions = {}
    transitions["response_1"] = {
        "left": "positive_1" if correct[0] == "left" else "negative_1",
        "right": "positive_1" if correct[0] == "right" else "negative_1",
    }
    transitions["fixation_2"] = {"fixation": "stimulus_2"}
    transitions["fixation_1"] = {"fixation": "stimulus_1"}
    transitions["stimulus_1"] = {"TO": "response_1"}
    transitions["positive_1"] = {"wait": "fixation_2"}
    transitions["negative_1"] = {"wait": "fixation_2"}

    graph = nk.Graph(nodes=nodes, start="fixation_1", transitions=transitions)

    result = ts.topological_sort(graph)

    assert set(result) == set(nodes), "Output nodes do not match input nodes"
    for src, transition_map in transitions.items():
        for _, dst in transition_map.items():
            assert result.index(src) < result.index(dst), (
                f"Invalid topological order: node '{src}' (index {result.index(src)}) "
                f"appears after its dependent node '{dst}' (index {result.index(dst)})."
            )

    assert result.index("fixation_1") < result.index("stimulus_1")
    assert result.index("stimulus_1") < result.index("response_1")
    assert result.index("positive_1") < result.index("fixation_2")
    assert result.index("negative_1") < result.index("fixation_2")


def test_example_fail():
    # Example 1:
    # Visual structure:
    #          n[f1] ────┐
    #            |       |
    #          n[s1]     |
    #            |       |
    #          n[r1]     |
    #          /   \     |
    #       n[p1] n[n1] ─┘
    #          \
    #          n[f2]
    #            |
    #          n[s2]

    # Pick images for the test:

    # Random correct answer:
    correct = ["left"]

    # Generate Nodes and transitions:
    nodes = {}
    nodes["stimulus_1"] = generate_stimulus_node()
    nodes["stimulus_2"] = generate_stimulus_node()
    nodes["response_1"] = generate_response_node()
    nodes["fixation_1"] = generate_fixation_node()
    nodes["fixation_2"] = generate_fixation_node()
    nodes["positive_1"] = generate_positive_node()
    nodes["negative_1"] = generate_negative_node()

    transitions = {}
    transitions["response_1"] = {
        "left": "positive_1" if correct[0] == "left" else "negative_1",
        "right": "positive_1" if correct[0] == "right" else "negative_1",
    }
    transitions["fixation_2"] = {"fixation": "stimulus_2"}
    transitions["fixation_1"] = {"fixation": "stimulus_1"}
    transitions["stimulus_1"] = {"TO": "response_1"}
    transitions["positive_1"] = {"wait": "fixation_2"}
    transitions["negative_1"] = {"wait": "fixation_1"}

    graph = nk.Graph(nodes=nodes, start="fixation_1", transitions=transitions)

    with pytest.raises(ValueError, match="Loop present in Graph"):
        ts.topological_sort(graph)


# %% Node, Sensor and transition checks:
def test_multiple_roots_tie_break():
    nodes = {
        "A": nk.Node(cards={}, sensors={"a": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "B": nk.Node(cards={}, sensors={"b": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "C": nk.Node(cards={}, sensors={"c": nk.sensors.TimeoutSensor(timeout_msec=1)}),
    }
    transitions = {
        "A": {"a": "C"},
        "B": {"b": "C"},
    }

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    result = ts.topological_sort(graph)

    # A and B both roots, check deterministic order based on incoming_sensors:
    assert result.index("A") < result.index("B")
    assert result.index("A") < result.index("C")
    assert result[-1] == "C"


def test_invalid_sensor_reference():
    nodes = {
        "A": nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "B": nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "C": nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
    }

    # Add transition from undefined sensor:
    transitions = {"B": {"s": "C"}, "A": {"r": "B"}}

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    with pytest.raises(KeyError, match="Sensor 'r' not found"):
        ts.topological_sort(graph)


def test_invalid_transition_node():
    nodes = {
        "A": nk.Node(cards={}, sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})
    }

    # Add transitions with non-existent Node
    transitions = {"A": {"s": "B"}}

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    with pytest.raises(KeyError, match="unknown node 'B'"):
        ts.topological_sort(graph)
