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

    graph = nk.concat(
        [fix_1, stim_1, response, fix_2, stim_2],
        ids=['fixation_1', 'stimulus_1', 'trial_1', 'fixation_2', 'stimulus_2']
        )

    for t in graph.transitions.items():
        print(t)

    # transitions["fixation_2"] = {"fixation": "stimulus_2"}
    # transitions["fixation_1"] = {"fixation": "stimulus_1"}
    # transitions["stimulus_1"] = {"TO": "response_1"}

test_example_pass()