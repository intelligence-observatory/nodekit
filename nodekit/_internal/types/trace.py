import pydantic

from nodekit import VERSION
from nodekit._internal.types.events import Event
import nodekit._internal.types.events as event_types
from nodekit._internal.types.graph import Graph
from nodekit._internal.version import validate_compatible_nodekit_version


# %%
class Trace(pydantic.BaseModel):
    nodekit_version: str = pydantic.Field(default=VERSION, validate_default=True)

    graph: Graph
    events: list[Event]

    @pydantic.field_validator("nodekit_version")
    @classmethod
    def validate_nodekit_version(cls, value: str) -> str:
        return validate_compatible_nodekit_version(value)

    def list_action_records(self) -> list[dict[str, object]]:
        """Project the [Trace][nodekit.Trace] to one action record per completed [Node][nodekit.Node].

        Each record pairs one [NodeStartedEvent][nodekit.events.NodeStartedEvent],
        one [ActionTakenEvent][nodekit.events.ActionTakenEvent], and one
        [NodeEndedEvent][nodekit.events.NodeEndedEvent] with the same
        [NodeAddress][nodekit.values.NodeAddress]. Non-Node lifecycle Events, such as
        pointer and key samples, are ignored.

        Each record contains the following keys:

        - ``step_index``: The zero-based index of the action record in the Trace.
        - ``node_address``: The [NodeAddress][nodekit.values.NodeAddress] of the Node.
        - ``action_type``: The [Action][nodekit.actions.Action] type.
        - ``action_value``: The Action value.
        - ``t_start``: The timestamp of the [NodeStartedEvent][nodekit.events.NodeStartedEvent].
        - ``t_action``: The timestamp of the [ActionTakenEvent][nodekit.events.ActionTakenEvent].
        - ``t_end``: The timestamp of the [NodeEndedEvent][nodekit.events.NodeEndedEvent].

        Returns:
            A list of action records in Trace order.

        Raises:
            ValueError: If Node lifecycle Events do not appear in strict
                NodeStartedEvent, ActionTakenEvent, NodeEndedEvent order, or if paired
                lifecycle Events have different Node addresses.
        """
        action_records: list[dict[str, object]] = []
        active_node_address: list[str] | None = None
        active_t_start: int | None = None
        active_action: object | None = None
        active_t_action: int | None = None

        for event in self.events:
            if isinstance(event, event_types.NodeStartedEvent):
                node_address = event.node_address
                if active_node_address is not None:
                    raise ValueError(
                        "Encountered NodeStartedEvent before the active Node ended. "
                        f"Active Node address: {active_node_address}; "
                        f"new Node address: {node_address}."
                    )
                active_node_address = node_address
                active_t_start = event.t

            elif isinstance(event, event_types.ActionTakenEvent):
                node_address = event.node_address
                if active_node_address is None:
                    raise ValueError(
                        f"Encountered ActionTakenEvent without an active Node: {node_address}."
                    )
                if node_address != active_node_address:
                    raise ValueError(
                        "Encountered ActionTakenEvent for a different Node than the active Node. "
                        f"Active Node address: {active_node_address}; "
                        f"action Node address: {node_address}."
                    )
                if active_action is not None:
                    raise ValueError(
                        f"Encountered multiple ActionTakenEvents for Node: {node_address}."
                    )
                active_action = event.action
                active_t_action = event.t

            elif isinstance(event, event_types.NodeEndedEvent):
                node_address = event.node_address
                if active_node_address is None:
                    raise ValueError(
                        f"Encountered NodeEndedEvent without an active Node: {node_address}."
                    )
                if node_address != active_node_address:
                    raise ValueError(
                        "Encountered NodeEndedEvent for a different Node than the active Node. "
                        f"Active Node address: {active_node_address}; "
                        f"ended Node address: {node_address}."
                    )
                if active_action is None:
                    raise ValueError(
                        f"Encountered NodeEndedEvent before ActionTakenEvent for Node: {node_address}."
                    )

                action_records.append(
                    {
                        "step_index": len(action_records),
                        "node_address": active_node_address,
                        "t_start": active_t_start,
                        "action_type": active_action.action_type,
                        "action_value": active_action.action_value,
                        "t_action": active_t_action,
                        "t_end": event.t,
                    }
                )
                active_node_address = None
                active_t_start = None
                active_action = None
                active_t_action = None

        if active_node_address is not None:
            raise ValueError(f"Trace ended before active Node completed: {active_node_address}.")

        return action_records
