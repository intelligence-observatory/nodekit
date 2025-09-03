import nodekit as nk
import random
from pathlib import Path

# %% Assemble a simple NodeGraph:
nodes = []


# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point
def make_basic_fixation_node(
        fixation_x: float,
        fixation_y: float,
) -> nk.Node:
    """
    Creates a simple Node which places a fixation point at the specified coordinates.
    The Node ends when the participant clicks on the fixation point.
    """

    fixation_card = nk.cards.FixationPointCard(
        card_shape=nk.types.BoardRectangle(
            width=0.05,
            height=0.05,
        ),
        card_location=nk.types.BoardLocation(
            x=fixation_x,
            y=fixation_y
        ),
        card_timespan=nk.types.Timespan(
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
for _ in range(5):
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

# %%
string = nk.compile.html(
    node_graph=node_graph,
)

Path('test.html').write_text(string)