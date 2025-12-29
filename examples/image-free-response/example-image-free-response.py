import nodekit as nk


def make_free_survey(image: nk.assets.Image, prompt: str) -> nk.Node:
    image_card = nk.cards.ImageCard(
        image=image,
        region=nk.Region(
            x=0,
            y=200,
            h=600,
            w=1000,
        ),
    )

    prompt_card = nk.cards.TextCard(
        text=prompt,
        region=nk.Region(x=0, y=-150, h=100, w=600),
    )

    return nk.Node(
        card=nk.cards.CompositeCard(
            children={
                "image": image_card,
                "prompt": prompt_card,
            }
        ),
        sensor=nk.sensors.TextEntrySensor(
            prompt="Enter your answer here",
            region=nk.Region(
                x=0,
                y=-300,
                w=prompt_card.region.w,
                h=200,
            ),
        ),
        board_color="#ffffff",
    )


if __name__ == "__main__":
    trial1 = make_free_survey(
        image=nk.assets.Image.from_path("san-diego.png"),
        prompt="Describe everything you notice in this image, as if you were explaining it to someone who can’t see it.",
    )

    trial2 = make_free_survey(
        image=nk.assets.Image.from_path("golden-pheasant.png"),
        prompt="What feelings does this image evoke in you?",
    )

    graph = nk.concat([trial1, trial2])
    nk.play(graph)
