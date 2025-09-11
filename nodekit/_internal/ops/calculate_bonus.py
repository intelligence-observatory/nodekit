from decimal import Decimal
from typing import List, Dict

from nodekit._internal.types.events.events import Event, EventTypeEnum
from nodekit._internal.types.node_graph import NodeGraph
from nodekit._internal.types.common import NodeId
from nodekit._internal.types.outcome import Outcome

import warnings

# %% BonusPolicy Rule Engine
def calculate_bonus_usd(
        events: List[Event],
        node_graph: NodeGraph,
) -> Decimal:
    """
    Calculates the current bonus USD earned based on the provided events and NodeGraph
    """

    calculated_amount = Decimal('0')

    node_id_to_consequences: Dict[NodeId, List[Outcome]] = {}
    for node in node_graph.nodes:
        node_id_to_consequences[node.node_id] = node.outcomes

    # Sort events by timestamp
    events = sorted(events, key=lambda ev: ev.event_timestamp)
    observed_node_ids = set()
    for ev in events:
        if ev.event_type != EventTypeEnum.NodeResultEvent:
            continue

        node_id = ev.event_payload.node_id
        action = ev.event_payload.action
        sensor_id = action.sensor_id

        # Skip if there was already an Event observed for this Node
        if node_id in observed_node_ids:
            warnings.warn(f"Multiple NodeResultEvents observed for Node ID {node_id}. Only the first will be considered for bonus calculation.")
            continue

        consequences = node_id_to_consequences[node_id]

        # Perform scan through consequences
        for consequence in consequences:
            if consequence.sensor_id == sensor_id:
                calculated_amount += Decimal(consequence.bonus_amount_usd)

        observed_node_ids.add(node_id)

    # Clip at minimum of 0:
    if calculated_amount < Decimal('0'):
        calculated_amount = Decimal('0.00')

    return calculated_amount