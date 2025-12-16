import nodekit as nk
import glob


def make_numerosity_trial(
    image: nk.assets.Image,
) -> nk.Graph:
    # Fixation Node:
    fixation_card = nk.cards.ImageCard(
        image=nk.assets.Image.from_path("fixation-cross.svg"),
        region=nk.Region(
            x=0,
            y=0,
            w=50,
            h=50,
        ),
    )

    fixation_node = nk.Node(
        sensor=nk.sensors.SelectSensor(choices={"fixation": fixation_card}),
    )

    # Stimulus Node:
    stimulus_node = nk.Node(
        stimulus=nk.cards.ImageCard(
            image=image,
            region=nk.Region(
                x=0,
                y=0,
                w=500,
                h=500,
            ),
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=500),
        hide_pointer=True,
    )

    # ISI Node:
    isi_node = nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=200),
        hide_pointer=True,
    )

    # Choice Node:
    choice_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text="How many circles were there?",
            background_color="#ffffff",  # white,
            region=nk.Region(
                w=400,
                x=0,
                y=-220,
                h=50,
            ),
        ),
        sensor=nk.sensors.TextEntrySensor(
            region=nk.Region(
                x=0,
                y=-350,
                w=150,
                h=150,
            ),
            prompt="",
            font_size=50,
            max_length=100,
        ),
    )

    return nk.concat(
        [
            fixation_node,
            stimulus_node,
            isi_node,
            choice_node,
        ],
        ["fixation", "stimulus", "isi", "choice"],
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
