from pathlib import Path

import nodekit as nk

# %%
if __name__ == "__main__":
    # Assemble an "all-in-one" Node which showcases multiple Cards simultaneously
    dev_node = nk.Node(
        cards={
            "video": nk.cards.VideoCard(
                x=0,
                y=0,
                w=0.3,
                h=0.3,
                video=nk.assets.Video.from_path("test-video.mp4"),
            ),
            "image": nk.cards.ImageCard(
                x=0.25,
                y=0,
                w=0.1,
                h=0.1,
                image=nk.assets.Image.from_path("fixation-cross.svg"),
            ),
            "advertisement": nk.cards.TextCard(
                x=-0.4,
                y=-0.4,
                w=0.2,
                h=0.1,
                text="I am a TextCard.",
                font_size=0.03,
                background_color="#E6E6E6",
                text_color="#000000",
                justification_horizontal="center",
                justification_vertical="center",
            ),
            "free-text-test": nk.cards.FreeTextEntryCard(
                x=0,
                y=0.4,
                h=0.2,
                w=0.6,
                prompt="I am a FreeTextEntryCard. Try typing into me.",
                text_color="#ce3a3a",
            ),
            "submit-button": nk.cards.TextCard(
                x=0,
                y=-0.4,
                w=0.2,
                h=0.1,
                text="Submit",
                font_size=0.03,
                background_color="#4CAF50",
                text_color="#ffffff",
                justification_horizontal="center",
                justification_vertical="center",
                selectable=True,
            ),
            "slider-horizontal": nk.cards.SliderCard(
                x=0,
                y=-0.25,
                h=0.05,
                w=1,
                num_bins=7,
                initial_bin_index=5,
                orientation="horizontal",
                show_bin_markers=True,
            ),
            "slider-horizontal2": nk.cards.SliderCard(
                x=0,
                y=-0.3,
                h=0.05,
                w=1,
                num_bins=100,
                initial_bin_index=25,
                orientation="horizontal",
                show_bin_markers=True,
            ),
            "slider-vertical": nk.cards.SliderCard(
                x=-0.25,
                y=0,
                h=0.3,
                w=0.1,
                num_bins=100,
                initial_bin_index=80,
                orientation="vertical",
                show_bin_markers=True,
            ),
        },
        sensors={
            # "wait": nk.sensors.TimeoutSensor(timeout_msec=5000),
            "submit": nk.sensors.SubmitSensor(
                submitter_id="submit-button",
                source_ids=[
                    "free-text-test",
                    "slider-horizontal",
                    "slider-horizontal2",
                    "slider-vertical",
                ],
            )
        },
    )

    graph = nk.concat([dev_node])

    # %% One can pack the Graph for later, or to share:
    savepath = Path("my_graph.nkg")
    if savepath.exists():
        savepath.unlink()
    nk.pack(graph, savepath)

    # %% Unpacking a Graph:
    graph_roundtrip = nk.unpack(savepath)

    # %% Play the Graph now:
    trace = nk.play(graph)

    # %%
    print(f"Observed {len(trace.events)} events:")
    for event in trace.events:
        print(event.event_type)
