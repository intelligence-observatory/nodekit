import nodekit as nk


# %%
def make_mcq_node(
    question_markdown: str,
    choices_markdown: list[str],
) -> nk.Node:
    """
    Assemble a multiple-choice question (MCQ) Node.
    The top 1/2 of the Board is dedicated to showing the question card.
    The bottom 1/2 of the Board is used to show the choice cards, stacked horizontally.
    The user clicks on a choice card to select it.
    """

    card_height = round(500 / len(choices_markdown) - 10)
    choices = {}
    for i_choice, choice_markdown in enumerate(choices_markdown):
        choice_card = nk.cards.TextCard(
            region=nk.Region(
                x=0,
                y=0 - (card_height + 10) * i_choice,
                w=1000,
                h=card_height,
            ),
            text=choice_markdown,
            justification_horizontal="left",
            justification_vertical="center",
            background_color="#e6e6e6",
        )
        choices[f"choice {i_choice}"] = choice_card

    return nk.Node(
        stimulus=nk.cards.TextCard(
            region=nk.Region(
                x=0,
                y=250,
                w=1000,
                h=400,
            ),
            text=question_markdown,
            justification_horizontal="left",
            justification_vertical="center",
            font_size=40,
        ),
        sensor=nk.sensors.SelectSensor(choices=choices),
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
