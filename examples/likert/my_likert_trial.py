import nodekit as nk


# %%
def make_likert_trial(
    question_markdown: str,
    ordinal_choice_descriptions: list[str],
    initial_index: int,
) -> nk.Node:
    """
    Assemble a Graph which elicits a Likert-style response to a question.
    The top 1/2 of the Board is dedicated to showing the question card.
    The bottom 1/2 of the Board is used to show the Likert scale and submit button.
    """
    if initial_index < 0 or initial_index >= len(ordinal_choice_descriptions):
        raise ValueError("initial_index must be between 0 and len(ordinal_choice_descriptions) - 1")

    question_card = nk.cards.TextCard(
        region=nk.Region(
            x=0,
            y=0.25,
            w=1,
            h=0.4,
        ),
        text=question_markdown,
        justification_horizontal="center",
        justification_vertical="center",
        font_size=0.04,
    )

    num_bins = len(ordinal_choice_descriptions)
    sensor = nk.sensors.SliderSensor(
        num_bins=num_bins,
        initial_bin_index=initial_index,
        orientation="horizontal",
        show_bin_markers=True,
        region=nk.Region(
            x=0,
            y=-0.1,
            w=0.75,
            h=0.1,
        ),
    )

    cards = {
        "question": question_card,
    }

    # Assemble annotation cards
    annotation_box_width = sensor.region.w / (num_bins - 1)
    slider_left = sensor.region.x - sensor.region.w / 2

    for i, description in enumerate(ordinal_choice_descriptions):
        cards[f"likert-description-{i}"] = nk.cards.TextCard(
            region=nk.Region(
                x=slider_left + (i) * annotation_box_width,
                y=sensor.region.y + sensor.region.h / 2 + 0.05,
                w=annotation_box_width,
                h=0.1,
            ),
            text=description,
            font_size=0.02,
            justification_horizontal="center",
            justification_vertical="bottom",
            background_color="#E6E6E600",  # Transparent
        )

    # Assemble Node
    stim = nk.cards.CompositeCard(children=cards)
    node = nk.Node(
        stimulus=stim,
        sensor=sensor,
        board_color="#ffffff",
    )

    return node


# %%
if __name__ == "__main__":
    # %% Assemble my Graph
    graph = nk.concat(
        [
            make_likert_trial(
                question_markdown="How likely are you to go to the **grocery store** tomorrow?",
                ordinal_choice_descriptions=[
                    "Very unlikely",
                    "Unlikely",
                    "Neutral",
                    "Likely",
                    "Very likely",
                ],
                initial_index=3,
            )
        ]
    )

    # %%
    trace = nk.play(graph)

    # %%
    nk.save_graph(graph, "likert-graph.nkg")
