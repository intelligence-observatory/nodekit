from typing import Dict
import nodekit as nk
import glob

import nodekit as nk
import inspect


def generate_fixation_node(image: nk.assets.ImageIdentifier,
                           x: float = 0, y: float = 0, w: float = 0.04, h: float = 0.04):
    
    fixation_card = nk.cards.ImageCard(x=x, y=y, w=w, h=h, image=image)
    click_sensor = nk.sensors.ClickSensor(mask='ellipse', 
                                          x = fixation_card.x,
                                          y = fixation_card.y,
                                          w = fixation_card.w,
                                          h = fixation_card.h)
    return nk.Node(
        cards=[fixation_card],
        sensors={"fixation": click_sensor}
    )


def generate_stimulus_node(stimulus: nk.assets.ImageIdentifier,
                           x: float = 0, y: float = 0, w: float = 0.5, h: float = 0.5):
    
    stimulus_card = nk.cards.ImageCard(x=x, y=y, w=w, h=h, image=stimulus)
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec = 2000)

    return nk.Node(
        cards=[stimulus_card],
        sensors={"TO": timeout_sensor}
    )


def generate_response_node(left_choice_image: nk.assets.ImageIdentifier, 
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
                           }):

    left_card = nk.cards.ImageCard(image=left_choice_image, **left_args)
    right_card = nk.cards.ImageCard(image=right_choice_image, **right_args)
    
    left_sensor = nk.sensors.ClickSensor(mask="rectangle", **left_args)
    right_sensor = nk.sensors.ClickSensor(mask="rectangle", **right_args)
    timeout_sensor = nk.sensors.TimeoutSensor(timeout_msec=2000)

    return nk.Node(
        cards = [left_card, right_card],
        sensors = {
            "left": left_sensor,
            "right": right_sensor,
            "TO": timeout_sensor,
        })


def generate_positive_node():
    positive_card = nk.cards.TextCard(
        text="Correct!",
        font_size=0.05, x=0, y=0, w=0.5, h=0.5,
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
        font_size=0.05, x=0, y=0,w=0.5, h=0.5,
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

if __name__ == "__main__":

    my_image_files = []
    for path in sorted(glob.glob("../example/example_images/*")):
        image_file = nk.assets.ImageFile.from_path(path)
        my_image_files.append(image_file)

    #%% Core experiment parameters
    corrects = {
        "trial_1": "left",
        "trial_2": "right",
        "trial_3": "left",
    }

    nodes = {}
    transitions = {}

    # Generate the Nodes and transitions:
    for i, (trial_name, correct_side) in enumerate(corrects.items()):

        # Pick images for this trial:
        fixation_img = my_image_files[0].identifier
        left_img = my_image_files[i].identifier
        right_img = my_image_files[i+1].identifier
        stim_img = my_image_files[i+2].identifier

        # Generate nodes:
        nodes[f"fixation_{i}"]= generate_fixation_node(fixation_img)
        nodes[f"stimulus_{i}"] = generate_stimulus_node(stim_img)
        nodes[f"response_{i}"] = generate_response_node(left_img, right_img)
        nodes[f"positive_{i}"] = generate_positive_node()
        nodes[f"negative_{i}"] = generate_negative_node()

        # Define transitions:
        transitions[f"fixation_{i}"] = {"fixation": f"stimulus_{i}"}
        transitions[f"stimulus_{i}"] = {"TO": f"response_{i}"}
        transitions[f"response_{i}"] = {
            "left": f"positive_{i}" if correct_side == "left" else f"negative_{i}",
            "right": f"positive_{i}" if correct_side == "right" else f"negative_{i}",
            "TO": f"negative_{i}",
        }

        if i + 1 < len(corrects):
            next_fixation = f"fixation_{i + 1}"
            transitions[f"positive_{i}"] = {"wait": next_fixation}
            transitions[f"negative_{i}"] = {"wait": next_fixation}


    #%% Generate the Graph:
    graph = nk.Graph(
        nodes = nodes,
        start = 'fixation_0',
        transitions = transitions
    )

    # %% Play the Graph:
    trace = nk.play(graph=graph, asset_files=my_image_files)

    print(f"Observed {len(trace.events)} events:")
    for event in trace.events:
        print(event.event_type)
