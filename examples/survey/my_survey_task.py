import nodekit as nk


# %%
def make_mcq_node(
    question_markdown: str,
    choices_markdown: list[str],
    minimum_choice_time_msec: int = 2000,
) -> nk.Node:
    """
    Assemble a multiple-choice question (MCQ) Node.
    The top 1/2 of the Board is dedicated to showing the question card.
    The bottom 1/2 of the Board is used to show the choice cards, stacked horizontally.
    The user clicks on a choice card to select it.
    """

    question_card = nk.cards.TextCard(
        x=0,
        y=0.25,
        w=1,
        h=0.4,
        text=question_markdown,
        justification_horizontal="left",
        justification_vertical="center",
        start_msec=0,
        font_size=0.04,
    )

    card_height = (1 / 2) / len(choices_markdown) - 0.01
    cards = {"question": question_card}
    choice_sensors = {}
    for i_choice, choice_markdown in enumerate(choices_markdown):
        choice_card = nk.cards.TextCard(
            x=0,
            y=0 - (card_height + 0.01) * i_choice,
            w=1,
            h=card_height,
            text=choice_markdown,
            justification_horizontal="left",
            justification_vertical="center",
            start_msec=0,
            background_color="#e6e6e6",
            selectable=True,
        )
        cards[f"choice {i_choice}"] = choice_card

        choice_sensor = nk.sensors.ClickSensor(
            x=choice_card.x,
            y=choice_card.y,
            w=choice_card.w,
            h=choice_card.h,
            start_msec=minimum_choice_time_msec,
        )
        choice_sensors[str(i_choice)] = choice_sensor

    return nk.Node(
        cards=cards,
        sensors=choice_sensors,
        board_color="#ffffff",
    )


# %% Assemble my Graph
graph = nk.concat(
    [
        make_mcq_node(
            question_markdown="How old are you?",
            choices_markdown=[
                "Under 18",
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65 or older",
            ],
        ),
        make_mcq_node(
            question_markdown="What is your sex assigned at birth?",
            choices_markdown=[
                "Female",
                "Male",
                "Intersex",
                "Prefer not to say",
            ],
        ),
        make_mcq_node(
            question_markdown="What is your gender identity?",
            choices_markdown=[
                "Woman",
                "Man",
                "Other",
                "Prefer not to say",
            ],
        ),
    ]
)

# %%
trace = nk.play(graph)
