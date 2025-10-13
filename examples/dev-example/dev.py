import glob
import nodekit as nk
from typing import Literal
from pathlib import Path

# %%
if __name__ == "__main__":
    # %% Load Asset Files
    my_image_files = []
    for path in sorted(glob.glob("./example_images/*")):
        image_file = nk.assets.Image.from_path(path)
        my_image_files.append(image_file)

    my_video_files = []
    for path in sorted(glob.glob("./example_videos/*.mp4")):
        video_file = nk.assets.Video.from_path(path)
        my_video_files.append(video_file)

    # %%
    my_trial = make_triplet_trial(
        stimulus_image=my_image_files[1],
        choice_left_image=my_image_files[2],
        choice_right_image=my_image_files[3],
        correct_choice="L",
    )

    fj_trial = make_fj_trial(
        stimulus_image=my_image_files[4],
        correct_choice="f",
    )

    fj_trial2 = make_fj_trial(
        stimulus_image=my_image_files[5],
        correct_choice="j",
    )

    video_node = nk.Node(
        cards={
            "video": nk.cards.VideoCard(
                x=0,
                y=0,
                w=0.3,
                h=0.3,
                video=my_video_files[0],
            ),
            "advertisement": nk.cards.TextCard(
                x=0,
                y=-0.4,
                w=0.6,
                h=0.1,
                text="Press space to continue.",
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
            ),
            "slider-test": nk.cards.SliderCard(
                x=0,
                y=0.4,
                h=0.2,
                w=0.6,
            ),
        },
        sensors={
            "wait": nk.sensors.TimeoutSensor(timeout_msec=5000),
            "press": nk.sensors.KeySensor(key=" "),
        },
    )

    graph = nk.concat([video_node, my_trial, my_trial, fj_trial, fj_trial2])

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
