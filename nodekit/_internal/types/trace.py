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
        """Project the Trace to one action record per completed Node.

        Each record pairs one NodeStartedEvent, one ActionTakenEvent, and one
        NodeEndedEvent with the same Node address. Non-Node lifecycle Events, such as
        pointer and key samples, are ignored.

        Returns:
            A list of action records in Trace order. Each record contains:
                - ``node_address``: The NodeAddress of the Node.
                - ``t_start``: The timestamp of the NodeStartedEvent.
                - ``action_type``: The Action discriminator.
                - ``action_value``: The Action value.
                - ``t_action``: The timestamp of the ActionTakenEvent.
                - ``t_end``: The timestamp of the NodeEndedEvent.

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
