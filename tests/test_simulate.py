import pydantic
import pytest

import nodekit as nk
import nodekit._internal.ops.simulate.simulate as simulate_module
import nodekit._internal.types.agents


class FixedActionAgent(nodekit._internal.types.agents.BaseAgent):
    def __init__(self, actions: list[nk.actions.Action]) -> None:
        self._actions = iter(actions)

    def __call__(self, node: nk.Node) -> nk.actions.Action:
        try:
            return next(self._actions)
        except StopIteration:
            return nk.actions.WaitAction()


def _node_addresses(trace: nk.Trace) -> list[list[str]]:
    return [
        event.node_address
        for event in trace.events
        if isinstance(event, nk.events.NodeStartedEvent)
    ]


def test_simulate_register_update_and_branch() -> None:
    graph = nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(
                stimulus=nk.cards.TextCard(text="start"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "next": nk.Node(
                stimulus=nk.cards.TextCard(text="next"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "fallback": nk.Node(
                stimulus=nk.cards.TextCard(text="fallback"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "start": nk.transitions.Go(
                to="next",
                register_updates={
                    "r": nk.expressions.Add(
                        lhs=nk.expressions.Lit(value=1),
                        rhs=nk.expressions.Lit(value=2),
                    )
                },
            ),
            "next": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.Reg(id="r"),
                    rhs=nk.expressions.Lit(value=3),
                ),
                then=nk.transitions.End(),
                else_=nk.transitions.Go(to="fallback"),
            ),
            "fallback": nk.transitions.End(),
        },
        registers={"r": 0},
    )

    trace = nk.simulate(graph)

    assert _node_addresses(trace) == [["start"], ["next"]]


def test_simulate_uses_last_action_in_transition() -> None:
    agent = FixedActionAgent(actions=[nk.actions.KeyAction(action_value="a")])
    graph = nk.Graph(
        start="choose",
        nodes={
            "choose": nk.Node(
                stimulus=nk.cards.TextCard(text="choose"),
                sensor=nk.sensors.KeySensor(keys=["a", "b"]),
            ),
            "left": nk.Node(
                stimulus=nk.cards.TextCard(text="left"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "right": nk.Node(
                stimulus=nk.cards.TextCard(text="right"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "choose": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.LastAction(),
                    rhs=nk.expressions.Lit(value="a"),
                ),
                then=nk.transitions.Go(to="left"),
                else_=nk.transitions.Go(to="right"),
            ),
            "left": nk.transitions.End(),
            "right": nk.transitions.End(),
        },
        registers={},
    )

    trace = nk.simulate(graph, agent=agent)

    assert _node_addresses(trace) == [["choose"], ["left"]]


def test_simulate_child_register_branching() -> None:
    child = nk.Graph(
        start="inner",
        nodes={
            "inner": nk.Node(
                stimulus=nk.cards.TextCard(text="inner"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={
            "inner": nk.transitions.End(
                register_updates={
                    "score": nk.expressions.Add(
                        lhs=nk.expressions.Lit(value=2),
                        rhs=nk.expressions.Lit(value=2),
                    )
                }
            )
        },
        registers={"score": 0},
    )

    graph = nk.Graph(
        start="child",
        nodes={
            "child": child,
            "after": nk.Node(
                stimulus=nk.cards.TextCard(text="after"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "fail": nk.Node(
                stimulus=nk.cards.TextCard(text="fail"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "child": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.ChildReg(id="score"),
                    rhs=nk.expressions.Lit(value=4),
                ),
                then=nk.transitions.Go(to="after"),
                else_=nk.transitions.Go(to="fail"),
            ),
            "after": nk.transitions.End(),
            "fail": nk.transitions.End(),
        },
        registers={"score": 0},
    )

    trace = nk.simulate(graph)

    assert _node_addresses(trace) == [["child", "inner"], ["after"]]


def test_simulate_dict_lookup_in_register_update() -> None:
    graph = nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(
                stimulus=nk.cards.TextCard(text="start"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "end": nk.Node(
                stimulus=nk.cards.TextCard(text="end"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "start": nk.transitions.Go(
                to="end",
                register_updates={
                    "picked": nk.expressions.GetDictValue(
                        d=nk.expressions.Lit(value={"a": 10}),
                        key=nk.expressions.Lit(value="a"),
                    )
                },
            ),
            "end": nk.transitions.End(),
        },
        registers={"picked": 0},
    )

    trace = nk.simulate(graph)
    assert _node_addresses(trace) == [["start"], ["end"]]


def test_simulate_raises_on_invalid_register_reference() -> None:
    with pytest.raises(pydantic.ValidationError):
        nk.Graph(
            start="start",
            nodes={
                "start": nk.Node(
                    stimulus=nk.cards.TextCard(text="start"),
                    sensor=nk.sensors.WaitSensor(duration_msec=1),
                )
            },
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Reg(id="missing"),
                    then=nk.transitions.End(),
                    else_=nk.transitions.End(),
                )
            },
            registers={"r1": 0},
        )


def test_simulate_raises_on_agent_returning_none() -> None:
    class NoneAgent(nodekit._internal.types.agents.BaseAgent):
        def __call__(self, node: nk.Node):
            return None

    graph = nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(
                stimulus=nk.cards.TextCard(text="start"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={
            "start": nk.transitions.End(),
        },
    )

    with pytest.raises(ValueError):
        nk.simulate(graph, agent=NoneAgent())


def test_random_agent_uses_seeded_rng(monkeypatch: pytest.MonkeyPatch) -> None:
    used_rngs: list[object] = []

    def fake_sample_action(sensor: nk.sensors.Sensor, rng=None) -> nk.actions.Action:
        used_rngs.append(rng)
        return nk.actions.WaitAction()

    monkeypatch.setattr(simulate_module, "sample_action", fake_sample_action)
    agent = nodekit._internal.types.agents.RandomGuesser(seed=123)

    node = nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=1),
    )
    agent(node)

    assert used_rngs == [agent.rng]
