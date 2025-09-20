import warnings
from decimal import Decimal
from typing import List

from nodekit._internal.types.events.events import Event, EventTypeEnum, NodeResultEvent
from nodekit._internal.types.node import Timeline


# %%
def calculate_bonus_usd(
        events: List[Event],
        timeline: Timeline,
) -> Decimal:
    """
    Calculates the current bonus USD earned based on the provided events.
    """

    calculated_amount = Decimal('0')

    # Sort events by timestamp
    events = sorted(events, key=lambda ev: ev.timestamp_event)
    observed_node_indices = set()
    for ev in events:
        if ev.event_type != EventTypeEnum.NodeResultEvent:
            continue

        ev: NodeResultEvent

        node_index = ev.node_index
        sensor_index = ev.sensor_index

        # Skip if there was already an Event observed for this Node
        if node_index in observed_node_indices:
            warnings.warn(f"Multiple NodeResultEvents observed for Timeline.nodes[{node_index}]. Only the first will be considered for bonus calculation.")
            continue

        sensor = timeline.nodes[node_index].sensors[sensor_index]

        outcome = sensor.outcome
        if outcome is None:
            continue

        calculated_amount += Decimal(outcome.bonus_amount_usd)
        observed_node_indices.add(node_index)

    # Clip at minimum of 0:
    if calculated_amount < Decimal('0'):
        calculated_amount = Decimal('0.00')

    return calculated_amount