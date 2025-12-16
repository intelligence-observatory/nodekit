import nodekit as nk


class FixedActionAgent(nk.Agent):
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


def test_simulate_updates_registers_and_branches() -> None:
    graph = nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(
                stimulus=nk.cards.TextCard(text="start"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "branch": nk.Node(
                stimulus=nk.cards.TextCard(text="branch"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "ok": nk.Node(
                stimulus=nk.cards.TextCard(text="ok"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "fail": nk.Node(
                stimulus=nk.cards.TextCard(text="fail"),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "start": nk.transitions.Go(
                to="branch",
                register_updates={
                    "r": nk.expressions.Add(
                        lhs=nk.expressions.Lit(value=1),
                        rhs=nk.expressions.Lit(value=2),
                    )
                },
            ),
            "branch": nk.transitions.Switch(
                on=nk.expressions.Reg(id="r"),
                cases={3: nk.transitions.Go(to="ok")},
                default=nk.transitions.Go(to="fail"),
            ),
            "ok": nk.transitions.End(),
            "fail": nk.transitions.End(),
        },
        registers={"r": 0},
    )

    trace = nk.simulate(graph)

    assert _node_addresses(trace) == [["start"], ["branch"], ["ok"]]


def test_simulate_uses_last_action_in_expressions() -> None:
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


def test_simulate_reads_child_registers_with_expressions() -> None:
    child_graph = nk.Graph(
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
                    "score": nk.expressions.Fold(
                        array=nk.expressions.Lit(value=[1, 2, 3]),
                        init=nk.expressions.Lit(value=0),
                        acc="acc",
                        cur="cur",
                        func=nk.expressions.Add(
                            lhs=nk.expressions.Local(name="acc"),
                            rhs=nk.expressions.Local(name="cur"),
                        ),
                    )
                }
            )
        },
        registers={"score": 0},
    )

    graph = nk.Graph(
        start="child",
        nodes={
            "child": child_graph,
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
            "child": nk.transitions.Switch(
                on=nk.expressions.ChildReg(id="score"),
                cases={6: nk.transitions.Go(to="after")},
                default=nk.transitions.Go(to="fail"),
            ),
            "after": nk.transitions.End(),
            "fail": nk.transitions.End(),
        },
        registers={"score": 0},
    )

    trace = nk.simulate(graph)

    assert _node_addresses(trace) == [["child", "inner"], ["after"]]
