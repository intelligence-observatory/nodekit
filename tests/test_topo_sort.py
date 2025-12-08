import pytest

import nodekit as nk
import nodekit._internal.ops.topological_sorting as ts


# %% Helper functions
def get_fixation_node() -> nk.Node:
    click_sensor = nk.sensors.ClickSensor(
        region=nk.Region(x=0, y=0, w=0.05, h=0.05, mask="ellipse")
    )
    return nk.Node(stimulus=None, sensor=click_sensor)


def get_stimulus_node():
    timeout_sensor = nk.sensors.WaitSensor(duration_msec=2000)

    return nk.Node(stimulus=None, sensor=timeout_sensor)


def get_response_node():
    left_sensor = nk.sensors.ClickSensor(
        region=nk.Region(x=-0.5, y=0, w=0.1, h=0.1, mask="rectangle")
    )
    right_sensor = nk.sensors.ClickSensor(
        region=nk.Region(x=0.5, y=0, w=0.1, h=0.1, mask="rectangle")
    )
    timeout_sensor = nk.sensors.WaitSensor(duration_msec=2000)

    return nk.Node(
        stimulus=None,
        sensor=nk.sensors.SumSensor(
            children={
                "left": left_sensor,
                "right": right_sensor,
                "TO": timeout_sensor,
            }
        ),
    )


def get_positive_node():
    return nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=1000),
    )


def get_negative_node():
    return nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=5000),
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
    nodes["stimulus_1"] = get_stimulus_node()
    nodes["stimulus_2"] = get_stimulus_node()
    nodes["response_1"] = get_response_node()
    nodes["fixation_1"] = get_fixation_node()
    nodes["fixation_2"] = get_fixation_node()
    nodes["positive_1"] = get_positive_node()
    nodes["negative_1"] = get_negative_node()

    transitions: dict[str, nk.transitions.Transition] = {}
    transitions["response_1"] = nk.transitions.Switch(
        on=nk.expressions.LastAction(),
        cases={
            "left": nk.transitions.Go(
                to="positive_1" if correct[0] == "left" else "negative_1"
            ),
            "right": nk.transitions.Go(
                to="positive_1" if correct[0] == "right" else "negative_1"
            ),
        },
        default=nk.transitions.End(),
    )
    transitions["fixation_2"] = nk.transitions.Go(to="stimulus_2")
    transitions["fixation_1"] = nk.transitions.Go(to="stimulus_1")
    transitions["stimulus_1"] = nk.transitions.Go(to="response_1")
    transitions["positive_1"] = nk.transitions.Go(to="fixation_2")
    transitions["negative_1"] = nk.transitions.Go(to="fixation_2")

    graph = nk.Graph(nodes=nodes, start="fixation_1", transitions=transitions)

    result = ts.topological_sort(graph)

    assert set(result) == set(nodes), "Output nodes do not match input nodes"
    for src, transition in transitions.items():
        for dst in ts._outgoing_targets(transition):
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
    nodes["stimulus_1"] = get_stimulus_node()
    nodes["stimulus_2"] = get_stimulus_node()
    nodes["response_1"] = get_response_node()
    nodes["fixation_1"] = get_fixation_node()
    nodes["fixation_2"] = get_fixation_node()
    nodes["positive_1"] = get_positive_node()
    nodes["negative_1"] = get_negative_node()

    transitions: dict[str, nk.transitions.Transition] = {}
    transitions["response_1"] = nk.transitions.Switch(
        on=nk.expressions.LastAction(),
        cases={
            "left": nk.transitions.Go(
                to="positive_1" if correct[0] == "left" else "negative_1"
            ),
            "right": nk.transitions.Go(
                to="positive_1" if correct[0] == "right" else "negative_1"
            ),
        },
        default=nk.transitions.End(),
    )
    transitions["fixation_2"] = nk.transitions.Go(to="stimulus_2")
    transitions["fixation_1"] = nk.transitions.Go(to="stimulus_1")
    transitions["stimulus_1"] = nk.transitions.Go(to="response_1")
    transitions["positive_1"] = nk.transitions.Go(to="fixation_2")
    transitions["negative_1"] = nk.transitions.Go(to="fixation_1")

    graph = nk.Graph(nodes=nodes, start="fixation_1", transitions=transitions)

    with pytest.raises(ValueError, match="Loop present in Graph"):
        ts.topological_sort(graph)


# %% Node, Sensor and transition checks:
def test_multiple_roots_tie_break():
    nodes = {
        "A": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
        "B": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
        "C": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
    }
    transitions = {
        "A": nk.transitions.Go(to="C"),
        "B": nk.transitions.Go(to="C"),
    }

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    result = ts.topological_sort(graph)

    # A and B both roots, check deterministic order based on incoming_sensors:
    assert result.index("A") < result.index("B")
    assert result.index("A") < result.index("C")
    assert result[-1] == "C"


def test_invalid_sensor_reference():
    nodes = {
        "A": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
        "B": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
        "C": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1)),
    }

    # Add transition from undefined node:
    transitions = {"A": nk.transitions.Go(to="B"), "B": nk.transitions.Go(to="D")}

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    with pytest.raises(KeyError, match="unknown node 'D'"):
        ts.topological_sort(graph)


def test_invalid_transition_node():
    nodes = {"A": nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1))}

    # Add transitions with non-existent Node
    transitions = {"A": nk.transitions.Go(to="B")}

    graph = nk.Graph(nodes=nodes, start="A", transitions=transitions)
    with pytest.raises(KeyError, match="unknown node 'B'"):
        ts.topological_sort(graph)
