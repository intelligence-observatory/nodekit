import nodekit as nk
import random
import time
from pathlib import Path
import glob
random.seed(42)

# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point:
def make_basic_fixation_node(
        fixation_x: float,
        fixation_y: float,
) -> nk.Node:
    """
    Creates a simple Node which places a fixation point at the specified coordinates.
    The Node ends when the participant clicks on the fixation point.
    """

    # Configure your Cards, which give context to the Participant:
    fixation_card = nk.cards.FixationPointCard(
        x=fixation_x,
        y=fixation_y,
        w=0.05,
        h=0.05,
    )

    color_card = nk.cards.BlankCard(
        x=0, y=0, w=0.1, h=0.1, color='#32a852',
    )

    # Define your Sensors, which will detect an Action from the Participant:
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(card_id=fixation_card.card_id)
    spacebar_sensor = nk.sensors.KeySensor(key=' ')
    timeout_sensor = nk.sensors.TimeoutSensor(t_armed=5000)

    # Set up your ConsequenceMap, which maps Actions to Consequences
    positive_card = nk.cards.TextCard(
        text='Yay',
        x=0, y=0, w=0.5, h=0.5,
        t_end=200,
    )

    negative_card = nk.cards.TextCard(
        text='Boo',
        x=0, y=0, w=0.5, h=0.5,
        t_end=400,
    )

    outcomes = [
        nk.Outcome(
            sensor_id=clicked_fixation_dot_sensor.sensor_id,
            cards=[positive_card],
            bonus_amount_usd='0.01'
        ),
        nk.Outcome(
            sensor_id=spacebar_sensor.sensor_id,
            cards=[negative_card],
            bonus_amount_usd='-0.01'
        ),
        nk.Outcome(
            sensor_id=timeout_sensor.sensor_id,
            cards=[negative_card],
            bonus_amount_usd='-0.05'
        )
    ]

    return nk.Node(
        cards=[color_card, fixation_card],
        sensors=[clicked_fixation_dot_sensor, spacebar_sensor],
        outcomes=outcomes,
    )

def make_image_node(
        image_file: nk.assets.ImageFile
) -> nk.Node:

    image_card = nk.cards.ImageCard(
        x=0, y = 0, w=0.5, h=0.5,
        image_identifier=image_file.identifier,
    )

    text_card = nk.cards.TextCard(
        text='Press space to continue',
        x=0, y=-0.4, w=0.5, h=0.1,
    )

    return nk.Node(
        cards=[image_card, text_card],
        sensors=[nk.sensors.KeySensor(key=' ')],
    )

def make_instructions_node() -> nk.Node:

    markdown_pages_card = nk.cards.MarkdownPagesCard(
        pages=[
            "# Welcome!\n\nThis is a test task.",
            "## Instructions\n\nBla bla bla.",
            "### More Instructions\n\nBla bla bla again.",
            "#### Final Instructions\n\nThis is the last page.",
        ],
        x=0, y=0, w=0.8, h=0.8,
    )

    return nk.Node(
        cards=[markdown_pages_card],
        sensors=[nk.sensors.DoneSensor(card_id=markdown_pages_card.card_id)],
    )


# %% Load ImageFiles
paths = sorted(glob.glob('./example_images/*.png'))
image_files =[]
for path in paths:
    image_file = nk.assets.ImageFile.from_path(Path(path))
    image_files.append(image_file)

# %%
nodes = []

nodes.append(
    make_instructions_node()
)

for image_file in image_files:
    node = make_image_node(
        image_file=image_file
    )
    nodes.append(node)


for _ in range(2):
    # Randomly sample fixation points:
    node = make_basic_fixation_node(
        fixation_x=round(random.uniform(-0.3, 0.3), 2),
        fixation_y=round(random.uniform(-0.3, 0.3), 2)
    )
    nodes.append(node)

# Generate preview of NodeGraph webpage:
node_graph = nk.NodeGraph(
    nodes=nodes,
    title="Test task (sandbox)",
    description='Test task',
    keywords=['test', 'example'],
    max_duration_sec=600,
    base_payment_usd='0.01',
)
Path('tmp.json').write_text(node_graph.model_dump_json(indent=4))

# %% Play the NodeGraph locally:
play_session = nk.play(
    node_graph,
    asset_files=image_files
)

# %% Wait until the end event is observed:
while True:
    events = play_session.list_events()
    if any(isinstance(event, nk.events.EndEvent) for event in events):
        break
    time.sleep(5)

# %% Can compute authoritative bonus based on the events and the bonus rules:
bonus_usd = nk.ops.calculate_bonus_usd(
    events=events,
    node_graph=node_graph,
)
print(f"Computed bonus: ${bonus_usd}")
