import nodekit as nk
import random
import time

# %% Assemble a simple NodeGraph:
nodes = []


# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point:
def make_keypress_node(
        key_to_press: str,
):
    assert len(key_to_press) == 1
    text_card = nk.cards.TextCard(
        text=f'Press the "{key_to_press}" key to continue.',
        x=0, y=0, w=0.5, h=0.2,
    )

    sensor = nk.sensors.KeySensor(
        key=key_to_press,  # noqa
    )
    return nk.Node(
        cards=[text_card],
        sensors=[sensor],
    )


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
    spacebar_sensor = nk.sensors.KeySensor(key=' ')

    # Set up your ConsequenceMap, which maps Actions to Consequences
    positive_card = nk.cards.TextCard(
        text='Yay',
        x=0, y=0, w=0.5, h=0.5
    )

    negative_card = nk.cards.TextCard(
        text='Boo',
        x=0, y=0, w=0.5, h=0.5
    )

    consequence_map = {
        click_sensor.sensor_id: [positive_card],
        spacebar_sensor.sensor_id: [negative_card],
        'timeout': [negative_card],
    }

    return nk.Node(
        cards=[fixation_card],
        sensors=[clicked_fixation_dot_sensor, spacebar_sensor],
        consequences=consequence_map
    )


random.seed(42)
bonus_rules = []
for _ in range(2):
    # Randomly sample fixation points:
    node = make_basic_fixation_node(
        fixation_x=round(random.uniform(-0.3, 0.3), 2),
        fixation_y=round(random.uniform(-0.3, 0.3), 2)
    )
    nodes.append(node)

    # Attach a bonus rule to each node:
    bonus_rule = nk.bonus_rules.ConstantBonusRule(
        node_id=node.node_id,
        sensor_id=node.sensors[0].sensor_id,
        bonus_amount_usd='0.01',
    )

    bonus_rules.append(bonus_rule)

nodes.append(
    make_keypress_node('a')
)

# Generate preview of NodeGraph webpage:
node_graph = nk.NodeGraph(
    nodes=nodes,
    title="Test task (sandbox)",
    description='Test task',
    keywords=['test', 'example'],
    max_duration_sec=600,
    base_payment_usd='0.01',
    bonus_rules=bonus_rules,
)

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
    bonus_rules=node_graph.bonus_rules,
)
print(f"Computed bonus: ${bonus_usd}")
