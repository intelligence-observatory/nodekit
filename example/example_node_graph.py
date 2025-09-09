import nodekit as nk
import random
import time

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

    # Define your Sensors, which will detect an Action from the Participant:
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(card_id=fixation_card.card_id)
    spacebar_sensor = nk.sensors.KeySensor(key=' ', t_end=5000)

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

    consequences = [
        nk.Consequence(
            sensor_id=clicked_fixation_dot_sensor.sensor_id,
            cards=[positive_card],
            bonus_amount_usd='0.01'
        ),
        nk.Consequence(
            sensor_id=spacebar_sensor.sensor_id,
            cards=[negative_card],
            bonus_amount_usd='-0.01'
        ),
    ]

    return nk.Node(
        cards=[fixation_card],
        sensors=[clicked_fixation_dot_sensor, spacebar_sensor],
        consequences=consequences,
    )


# %%
nodes = []
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


raise Exception

# %% Play the NodeGraph locally:
play_session = nk.play(node_graph)

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
