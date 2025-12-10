import nodekit as nk


def make_text_node(text: str) -> nk.Node:
    stimulus = nk.cards.TextCard(
        text=text,
        justification_horizontal="left",
        justification_vertical="center",
        font_size=0.02,
        region=nk.Region(
            x=0,
            y=0,
            w=1,
            h=0.6,
        ),
    )
    sensor = nk.sensors.ClickSensor(
        region=nk.Region(
            x=0,
            y=0,
            w=1,
            h=1,
        )
    )
    return nk.Node(
        stimulus=stimulus,
        sensor=sensor,
        board_color="#ffffff",
    )


if __name__ == "__main__":
    from pathlib import Path

    node = make_text_node(
        text=Path(__file__)
        .parent.joinpath("lorem.txt")
        .resolve()
        .read_text(encoding="utf-8")
    )
    graph = nk.concat([node])
    trace = nk.play(graph)
    print(trace)
