import nodekit as nk


# %%
def make_node(difficulty_level: int) -> nk.Node:
    node = nk.Node(
        stimulus=nk.cards.TextCard(
            text=f"This is difficulty level {difficulty_level}.",
            font_size=0.05,
            region=nk.Region(
                x=0,
                y=0,
                w=0.8,
                h=0.15,
            ),
        ),
        sensor=nk.sensors.KeySensor(keys=["f", "j"]),
    )

    return node


# %%
easy_node = make_node(difficulty_level=1)
medium_node = make_node(difficulty_level=2)
hard_node = make_node(difficulty_level=3)
