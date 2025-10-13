from pathlib import Path
import pytest
import nodekit._internal.ops.topological_sorting as ts
import nodekit as nk

from typing import Dict


# %% Helper functions
def generate_fixation_node(
    image: nk.assets.ImageIdentifier,
    x: float = 0,
    y: float = 0,
    w: float = 0.04,
    h: float = 0.04,
):
    fixation_card = nk.cards.ImageCard(x=x, y=y, w=w, h=h, image=image)
    click_sensor = nk.sensors.ClickSensor(
        mask="ellipse",
        x=fixation_card.x,
        y=fixation_card.y,
        w=fixation_card.w,
        h=fixation_card.h,
    )
    return nk.Node(cards=[fixation_card], sensors={"fixation": click_sensor})


def generate_stimulus_node(
    stimulus: nk.assets.ImageIdentifier,
    x: float = 0,
    y: float = 0,
    w: float = 0.5,
    h: float = 0.5,
):
    stimulus_card = nk.cards.ImageCard(x=x, y=y, w=w, h=h, image=stimulus)
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(cards=[stimulus_card], sensors={"TO": timeout_sensor})


def generate_response_node(
    left_choice_image: nk.assets.ImageIdentifier,
    right_choice_image: nk.assets.ImageIdentifier,
    left_args: Dict[str, float | int] = {
        "x": -0.25,
        "y": -0.3,
        "w": 0.2,
        "h": 0.2,
    },
    right_args: Dict[str, float] = {
        "x": 0.25,
        "y": -0.3,
        "w": 0.2,
        "h": 0.2,
    },
):
    left_card = nk.cards.ImageCard(image=left_choice_image, **left_args)
    right_card = nk.cards.ImageCard(image=right_choice_image, **right_args)

    left_sensor = nk.sensors.ClickSensor(mask="rectangle", **left_args)
    right_sensor = nk.sensors.ClickSensor(mask="rectangle", **right_args)
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(
        cards=[left_card, right_card],
        sensors={
            "left": left_sensor,
            "right": right_sensor,
            "TO": timeout_sensor,
        },
    )


def generate_positive_node():
    positive_card = nk.cards.TextCard(
        text="Correct!",
        font_size=0.05,
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        background_color="#32a852",
        text_color="#ffffff",
        justification_horizontal="center",
        justification_vertical="center",
    )
    positive_timeout_sensor = nk.sensors.TimeoutSensor(
        timeout_msec=500,
    )
    return nk.Node(
        cards=[positive_card],
        sensors={"wait": positive_timeout_sensor},
    )


def generate_negative_node():
    negative_card = nk.cards.TextCard(
        text="Incorrect.",
        font_size=0.05,
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        background_color="#a83232",
        text_color="#ffffff",
        justification_horizontal="center",
        justification_vertical="center",
    )
    negative_timeout_sensor = nk.sensors.TimeoutSensor(
        timeout_msec=1000,
    )

    return nk.Node(
        cards=[negative_card],
        sensors={"wait": negative_timeout_sensor},
    )


# %% Topology tests:


@pytest.fixture(scope="module")
def my_image_files():
    test_dir = Path(__file__).resolve().parent
    example_dir = test_dir.parent.parent / "example" / "example_images"

    my_image_files = []
    for path in sorted(example_dir.glob("*")):
        image_file = nk.assets.ImageFile.from_path(path)
        my_image_files.append(image_file)

    return my_image_files


def test_example_pass(my_image_files):
    # %% Example 1:
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

    # Pick images for the test:
    fixation_img = my_image_files[0].identifier
    left_img = my_image_files[1].identifier
    right_img = my_image_files[2].identifier
    stim_img = my_image_files[3].identifier

    # Random correct answer:
    correct = ["left"]

    # Generate Nodes and transitions:
    nodes = {}
    nodes["stimulus_1"] = generate_stimulus_node(stim_img)
    nodes["stimulus_2"] = generate_stimulus_node(stim_img)
    nodes["response_1"] = generate_response_node(left_img, right_img)
    nodes["fixation_1"] = generate_fixation_node(fixation_img)
    nodes["fixation_2"] = generate_fixation_node(fixation_img)
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

    result = ts.topological_sort(nodes, transitions)

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


def test_example_fail(my_image_files):
    # %% Example 1:
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
    fixation_img = my_image_files[0].identifier
    left_img = my_image_files[1].identifier
    right_img = my_image_files[2].identifier
    stim_img = my_image_files[3].identifier

    # Random correct answer:
    correct = ["left"]

    # Generate Nodes and transitions:
    nodes = {}
    nodes["stimulus_1"] = generate_stimulus_node(stim_img)
    nodes["stimulus_2"] = generate_stimulus_node(stim_img)
    nodes["response_1"] = generate_response_node(left_img, right_img)
    nodes["fixation_1"] = generate_fixation_node(fixation_img)
    nodes["fixation_2"] = generate_fixation_node(fixation_img)
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

    with pytest.raises(ValueError, match="Loop present in Graph"):
        ts.topological_sort(nodes, transitions)


# %% Node, Senor and transition checks:


def test_multiple_roots_tie_break():
    nodes = {
        "A": nk.Node(cards=[], sensors={"a": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "B": nk.Node(cards=[], sensors={"b": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "C": nk.Node(cards=[], sensors={"c": nk.sensors.TimeoutSensor(timeout_msec=1)}),
    }
    transitions = {
        "A": {"a": "C"},
        "B": {"b": "C"},
    }
    result = ts.topological_sort(nodes, transitions)

    # A and B both roots, check deterministic order based on incoming_sensors:
    assert result.index("A") < result.index("B")
    assert result.index("A") < result.index("C")
    assert result[-1] == "C"


def test_invalid_sensor_reference():
    nodes = {
        "A": nk.Node(cards=[], sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "B": nk.Node(cards=[], sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
        "C": nk.Node(cards=[], sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)}),
    }

    # Add transition from undefined sensor:
    transitions = {"B": {"s": "C"}, "A": {"r": "B"}}
    with pytest.raises(KeyError, match="Sensor 'r' not found"):
        ts.topological_sort(nodes, transitions)


def test_invalid_transition_node():
    nodes = {
        "A": nk.Node(cards=[], sensors={"s": nk.sensors.TimeoutSensor(timeout_msec=1)})
    }

    # Add transitions with non-existent Node
    transitions = {"A": {"s": "B"}}
    with pytest.raises(KeyError, match="unknown node 'B'"):
        ts.topological_sort(nodes, transitions)
