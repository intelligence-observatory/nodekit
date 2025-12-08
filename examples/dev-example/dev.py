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
                        w=0.3,
                        h=0.3,
                    ),
                    video=nk.assets.Video.from_path("test-video.mp4"),
                ),
                "image": nk.cards.ImageCard(
                    region=nk.Region(
                        x=0.25,
                        y=0,
                        w=0.1,
                        h=0.1,
                    ),
                    image=nk.assets.Image.from_path("fixation-cross.svg"),
                ),
                "advertisement": nk.cards.TextCard(
                    region=nk.Region(
                        x=-0.4,
                        y=-0.4,
                        w=0.2,
                        h=0.1,
                    ),
                    text="I am a TextCard.",
                    font_size=0.03,
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
                        y=0.4,
                        h=0.2,
                        w=0.6,
                    ),
                    prompt="I am a TextEntrySensor. Try typing into me.",
                ),
                "slider-vertical": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=-0.25,
                        y=0,
                        h=0.3,
                        w=0.1,
                    ),
                    num_bins=100,
                    initial_bin_index=80,
                    orientation="vertical",
                    show_bin_markers=True,
                ),
                "slider-horizontal": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=0,
                        y=-0.25,
                        h=0.05,
                        w=1,
                    ),
                    num_bins=7,
                    initial_bin_index=5,
                    orientation="horizontal",
                    show_bin_markers=True,
                ),
                "slider-horizontal2": nk.sensors.SliderSensor(
                    region=nk.Region(
                        x=0,
                        y=-0.3,
                        h=0.05,
                        w=1,
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
                                y=-0.4,
                                w=0.2,
                                h=0.1,
                            ),
                            text="Submit",
                            font_size=0.03,
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
