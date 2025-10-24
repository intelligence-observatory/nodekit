import nodekit as nk

def make_free_survey(
        image: nk.assets.Image,
        prompt: str
) -> nk.Node:

    image_card = nk.cards.ImageCard(
        image=image,
        x=0,
        y=0.2,
        h=0.6,
        w=1,
    )

    prompt_card = nk.cards.TextCard(
        text=prompt,
        x=0,
        y=-0.15,
        h=0.1,
        w=0.6
    )

    free_response_card = nk.cards.FreeTextEntryCard(
        prompt='Enter your answer here',
        x=0,
        y=-0.3,
        w=prompt_card.w,
        h=0.2,
    )

    submit_button = nk.cards.TextCard(
        x=0,
        y=-0.45,
        h=0.04,
        w=free_response_card.w/2,
        font_size=0.02,
        text='Submit response',
        selectable=True,
        background_color='#e6e6e6'
    )

    return nk.Node(
        cards={
            'stimulus': image_card,
            'prompt_card': prompt_card,
            'free-response': free_response_card,
            'submit-button': submit_button,
        },
        sensors={
            'submit':nk.sensors.SubmitSensor(
                source_ids=['free-response'],
                submitter_id='submit-button',
            )
        },
        board_color='#ffffff',
    )


if __name__ == '__main__':
    trial1 = make_free_survey(
        image=nk.assets.Image.from_path('san-diego.png'),
        prompt='Describe everything you notice in this image, as if you were explaining it to someone who can’t see it.',
    )

    trial2 = make_free_survey(
        image=nk.assets.Image.from_path('golden-pheasant.png'),
        prompt='What feelings does this image evoke in you?',
    )

    graph = nk.concat([trial1, trial2])
    nk.play(graph)