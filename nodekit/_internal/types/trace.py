import pydantic

from nodekit import VERSION
from nodekit._internal.types.actions import Action
from nodekit._internal.types.events import Event
import nodekit._internal.types.events as event_types
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.values import NodeAddress, TimeElapsedMsec
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

    def list_steps(self) -> list['StepRecord']:
        """Project the [Trace][nodekit.Trace] to one StepRecord per completed [Node][nodekit.Node].

        Each record pairs one [NodeStartedEvent][nodekit.events.NodeStartedEvent],
        one [ActionTakenEvent][nodekit.events.ActionTakenEvent], and one
        [NodeEndedEvent][nodekit.events.NodeEndedEvent] with the same
        [NodeAddress][nodekit.values.NodeAddress]. Non-Node lifecycle Events, such as
        pointer and key samples, are ignored.

        Each record contains the following keys:

        - ``step_index``: The zero-based index of the StepRecord in the Trace.
        - ``node_address``: The [NodeAddress][nodekit.values.NodeAddress] of the Node.
        - ``action``: The [Action][nodekit.actions.Action] taken at the Node.
        - ``t_start``: The timestamp of the [NodeStartedEvent][nodekit.events.NodeStartedEvent].
        - ``t_action``: The timestamp of the [ActionTakenEvent][nodekit.events.ActionTakenEvent].
        - ``t_end``: The timestamp of the [NodeEndedEvent][nodekit.events.NodeEndedEvent].

        Returns:
            A list of StepRecords in Trace order.

        Raises:
            ValueError: If Node lifecycle Events do not appear in strict
                NodeStartedEvent, ActionTakenEvent, NodeEndedEvent order, or if paired
                lifecycle Events have different Node addresses.
        """
        step_records: list[StepRecord] = []
        active_node_address: NodeAddress | None = None
        active_t_start: int | None = None
        active_action: Action | None = None
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
                if active_t_start is None or active_t_action is None:
                    raise ValueError(
                        f"Trace is missing lifecycle timestamps for Node: {node_address}."
                    )

                step_records.append(
                    StepRecord(
                        step_index=len(step_records),
                        node_address=active_node_address,
                        action=active_action,
                        t_start=active_t_start,
                        t_action=active_t_action,
                        t_end=event.t,
                    )
                )
                active_node_address = None
                active_t_start = None
                active_action = None
                active_t_action = None

        if active_node_address is not None:
            raise ValueError(f"Trace ended before active Node completed: {active_node_address}.")

        return step_records


# %%
class StepRecord(pydantic.BaseModel):
    """A realized `(Node, Action)` step in a [Trace][nodekit.Trace].

    A StepRecord is a canonical projection of one completed Node visit in a
    Trace. It pairs the Node address with the Action taken there, plus the
    timestamps for when the Node started, when the Action was taken, and when
    the Node ended.
    """

    step_index: int = pydantic.Field(
        ge=0,
        description="The zero-based index of the StepRecord in the Trace.",
    )
    node_address: NodeAddress = pydantic.Field(description="The address of the completed Node.")
    action: Action = pydantic.Field(description="The Action taken at the Node.")
    t_start: TimeElapsedMsec = pydantic.Field(description="The timestamp of the NodeStartedEvent.")
    t_action: TimeElapsedMsec = pydantic.Field(description="The timestamp of the ActionTakenEvent.")
    t_end: TimeElapsedMsec = pydantic.Field(description="The timestamp of the NodeEndedEvent.")

