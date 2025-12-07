import nodekit as nk
import glob


def make_numerosity_trial(
    image: nk.assets.Image,
) -> nk.Graph:
    # Make fixation Node
    fixation_card = nk.cards.ImageCard(
        image=nk.assets.Image.from_path("fixation-cross.svg"),
        x=0,
        y=0,
        w=0.05,
        h=0.05,
    )
    click_sensor = nk.sensors.ClickSensor(
        x=fixation_card.x,
        y=fixation_card.y,
        w=fixation_card.w,
        h=fixation_card.h,
    )

    fixation_node = nk.Node(
        cards={"fixation": fixation_card},
        sensors={"fixated": click_sensor},
    )

    # Make numerosity node
    stimulus_duration = 500
    delay = 200

    stimulus_card_card = nk.cards.ImageCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        image=image,
        start_msec=0,
        end_msec=stimulus_duration,
    )
    prompt_card = nk.cards.TextCard(
        text="How many circles were there?",
        background_color="#ffffff",  # white,
        w=0.4,
        x=0,
        y=-0.22,
        h=0.05,
        start_msec=stimulus_duration + delay,
    )
    free_text_card = nk.cards.FreeTextEntryCard(
        x=0,
        y=-0.3,
        w=0.15,
        h=0.06,
        start_msec=stimulus_duration + delay,
        prompt="",
        font_size=0.05,
        max_length=100,
        text_color="#2d2dbd",
    )
    submit_card = nk.cards.TextCard(
        x=0,
        y=-0.4,
        w=0.15,
        h=0.04,
        start_msec=stimulus_duration + delay,
        text="**Submit**",
        background_color="#c8c8c8",  # white,
        selectable=True,
    )

    main_node = nk.Node(
        cards={
            "stimulus": stimulus_card_card,
            "prompt": prompt_card,
            "count-text": free_text_card,
            "submit-button": submit_card,
        },
        sensors={
            "submitted-count": submit_sensor,
        },
        effects=[
            nk.effects.HidePointerEffect(
                start_msec=0,
                end_msec=free_text_card.start_msec,
            )
        ],
    )

    return nk.concat(
        [
            fixation_node,
            main_node,
        ],
        ["fixation", "main"],
    )


if __name__ == "__main__":
    images = sorted(glob.glob("./images/*.svg"))
    import random

    random.Random(0).shuffle(images)
    trials = []
    for image_path in images:
        trials.append(make_numerosity_trial(nk.assets.Image.from_path(image_path)))

    graph = nk.concat(trials)

    nk.play(graph)
