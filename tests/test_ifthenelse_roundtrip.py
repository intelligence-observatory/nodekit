import nodekit as nk


def test_ifthenelse_roundtrip():
    graph = nk.Graph(
        nodes={
            "start": nk.Node(
                stimulus=None,
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
            "done": nk.Node(
                stimulus=None,
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={
            "start": nk.transitions.IfThenElse(
                if_=nk.expressions.Lit(value=True),
                then=nk.transitions.Go(to="done"),
                else_=nk.transitions.End(),
            ),
            "done": nk.transitions.End(),
        },
        start="start",
    )

    dumped = graph.model_dump(by_alias=True)

    # Ensure that the dumped IfThenElse serializes to 'if' and 'else', not 'if_' and 'else_'
    assert "if" in dumped["transitions"]["start"]
    assert "else" in dumped["transitions"]["start"]

    restored = nk.Graph.model_validate(dumped)
    transition = restored.transitions["start"]

    assert isinstance(transition, nk.transitions.IfThenElse)
    assert isinstance(transition.then, nk.transitions.Go)
    assert transition.then.to == "done"
    assert isinstance(transition.else_, nk.transitions.End)
