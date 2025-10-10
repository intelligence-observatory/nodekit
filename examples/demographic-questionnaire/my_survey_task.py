import nodekit as nk


# %%
def make_multiple_choice_question_node(
        question_markdown: str,
        choices_markdown: list[str],
        minimum_choice_time_msec: int = 1000,
) -> nk.Node:
    """
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
        justification_horizontal='left',
        justification_vertical='center',
        start_msec=0,
    )


    card_height = (1/2) / len(choices_markdown) - 0.01

    choice_cards = [
        nk.cards.TextCard(
            x=0,
            y=0-(card_height+0.01)*i,
            w=1,
            h=card_height,
            text=choice_markdown,
            justification_horizontal='left',
            justification_vertical='center',
            start_msec=0,
            background_color='#e6e6e6'
        )
        for i, choice_markdown in enumerate(choices_markdown)
    ]

    choice_sensors = {}
    for i_choice, choice_card in enumerate(choice_cards):
        choice_sensor = nk.sensors.ClickSensor(
            x=choice_card.x,
            y=choice_card.y,
            w=choice_card.w,
            h=choice_card.h,
            start_msec=minimum_choice_time_msec,
        )
        choice_sensors[str(i_choice)] = choice_sensor

    return nk.Node(
        cards=[question_card] + choice_cards,
        sensors=choice_sensors,
        board_color="#ffffff"
    )


# %% Assemble my Graph
graph = nk.concat(
    [
        make_multiple_choice_question_node(
            question_markdown="# How old are you?",
            choices_markdown=[
                "Under 18",
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65 or older"
            ],
        )
    ]
)

# %%
trace = nk.play(graph)

# %% Map to DataFrame format