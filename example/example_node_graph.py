import nodekit as nk
import random
import time

# %% Assemble a simple NodeGraph:
nodes = []


# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point
def make_keypress_node(
        key_to_press: str,
):
    assert len(key_to_press) == 1
    text_card = nk.cards.TextCard(
        card_parameters=nk.cards.TextCard.Parameters(
            content=nk.common.TextContent(
                text=f'Press the "{key_to_press}" key to continue.',
                justification_horizontal='center',
                justification_vertical='center'
            )
        ),
        card_shape=nk.common.BoardRectangle(
            width=0.5,
            height=0.2,
        ),
        card_location=nk.common.BoardLocation(
            x=0,
            y=0
        ),
        card_timespan=nk.common.Timespan(
            start_time_msec=0,
        ),
    )

    sensor = nk.sensors.KeyPressSensor(
        sensor_parameters=nk.sensors.KeyPressSensor.Parameters(
            keys={key_to_press},
        ),
        sensor_timespan=nk.common.Timespan(
            start_time_msec=0,
        )
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

    fixation_card = nk.cards.FixationPointCard(
        card_shape=nk.common.BoardRectangle(
            width=0.05,
            height=0.05,
        ),
        card_location=nk.common.BoardLocation(
            x=fixation_x,
            y=fixation_y
        ),
        card_timespan=nk.common.Timespan(
            start_time_msec=0,
        ),
    )

    click_sensor = nk.sensors.ClickSensor(
        card_id=fixation_card.card_id,
        sensor_timespan=fixation_card.card_timespan
    )

    return nk.Node(
        cards=[fixation_card],
        sensors=[click_sensor]
    )


random.seed(42)
bonus_rules = []
for _ in range(2):
    # Randomly sample fixation points
    node = make_basic_fixation_node(
        fixation_x=round(random.uniform(-0.3, 0.3), 2),
        fixation_y=round(random.uniform(-0.3, 0.3), 2)
    )
    nodes.append(node)

    # Attach a bonus rule to each node
    bonus_rule = nk.bonus_rules.ConstantBonusRule(
        bonus_rule_parameters=nk.bonus_rules.ConstantBonusRule.Parameters(
            sensor_id=node.sensors[0].sensor_id,
            bonus_amount_usd='0.01',
        )
    )

    bonus_rules.append(bonus_rule)

nodes.append(
    make_keypress_node('a')
)

# Generate preview of NodeGraph webpage:
node_graph = nk.NodeGraph(
    nodes=nodes,
    bonus_rules=bonus_rules,
    title="Test task (sandbox)",
    description='Test task',
    keywords=['test', 'example'],
    max_duration_sec=600,
    base_payment_usd='0.01',
)

# %% Play the NodeGraph locally
play_session = nk.play(node_graph)

# %% Wait until the end event is observed:
while True:
    events = play_session.list_events()
    if any(isinstance(event, nk.events.EndEvent) for event in events):
        break
    time.sleep(5)


# %% Can compute authoritative bonus based on the events and the bonus rules:
bonus_usd = nk.ops.calculate_bonus_usd(
    events = events,
    bonus_rules=node_graph.bonus_rules,
)
print(f"Computed bonus: ${bonus_usd}")