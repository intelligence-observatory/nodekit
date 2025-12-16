from pathlib import Path

import nodekit as nk

# %%
if __name__ == "__main__":
    # Assemble an "all-in-one" Node which showcases multiple Cards simultaneously
    dev_node = nk.Node(
        stimulus=nk.cards.CompositeCard(
            children={
                "video": nk.cards.VideoCard(
                    region=nk.Region(
                        x=0,
                        y=0,
                        w=300,
                        h=300,
                    ),
                    video=nk.assets.Video.from_path("test-video.mp4"),
                ),
                "image": nk.cards.ImageCard(
                    region=nk.Region(
                        x=250,
                        y=0,
                        w=100,
                        h=100,
                    ),
                    image=nk.assets.Image.from_path("fixation-cross.svg"),
                ),
                "advertisement": nk.cards.TextCard(
                    region=nk.Region(
                        x=-400,
                        y=-400,
                        w=200,
                        h=100,
                    ),
                    text="I am a TextCard.",
                    font_size=30,
                    background_color="#E6E6E6",
                    text_color="#000000",
                    justification_horizontal="center",
                    justification_vertical="center",
                ),
            }
        ),
        sensor=nk.sensors.ProductSensor(
            children={
                "free-text-test": nk.sensors.TextEntrySensor(
                    region=nk.Region(
                        x=0,
                        y=400,
                        h=200,
                        w=600,
                    ),
                    prompt="I am a TextEntrySensor. Try typing into me.",
                ),
                "slider-vertical": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=-250,
                        y=0,
                        h=300,
                        w=100,
                    ),
                    num_bins=100,
                    initial_bin_index=80,
                    orientation="vertical",
                    show_bin_markers=True,
                ),
                "slider-horizontal": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=0,
                        y=-250,
                        h=50,
                        w=1024,
                    ),
                    num_bins=7,
                    initial_bin_index=5,
                    orientation="horizontal",
                    show_bin_markers=True,
                ),
                "slider-horizontal2": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=0,
                        y=-300,
                        h=50,
                        w=1024,
                    ),
                    num_bins=100,
                    initial_bin_index=25,
                    orientation="horizontal",
                    show_bin_markers=True,
                ),
                "affirm": nk.sensors.SelectSensor(
                    choices={
                        "submit-button": nk.cards.TextCard(
                            region=nk.Region(
                                x=0,
                                y=-400,
                                w=200,
                                h=100,
                            ),
                            text="Submit",
                            font_size=30,
                            background_color="#4CAF50",
                            text_color="#ffffff",
                            justification_horizontal="center",
                            justification_vertical="center",
                        ),
                    }
                ),
            }
        ),
    )

    graph = nk.concat([dev_node])

    # %% One can pack the Graph for later, or to share:
    savepath = Path("my_graph.nkg")
    if savepath.exists():
        savepath.unlink()
    nk.save_graph(graph, savepath)

    # %% Unpacking a Graph:
    graph_roundtrip = nk.load_graph(savepath)

    # %% Build a site
    build_result = nk.build_site(graph_roundtrip, "my-site")
    print(build_result)

    # %% Play the Graph now:
    trace = nk.play(graph)

    # %%
    print(f"Observed {len(trace.events)} events:")
    for event in trace.events:
        print(event.event_type)
