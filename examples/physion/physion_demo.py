"""
Reproduces the paradigm described in "Physion..." by Bear et al. Neurips 2021
https://cogtoolslab.github.io/pdf/BWMB_neurips_2021.pdf

* Show fixation cross between 500 and 1500 ms
  * Show first frame of video for 2000 msec. During this time, flash an overlay on/off at 2 Hz – i.e. 4 times
  * Then play video for 1500 msec
  * Then remove the video and activate yes/no buttons; randomized order.
    * I will also add a text prompt.
  * provide feedback at end of session
"""

import nodekit as nk
import random
from typing import Literal
def make_physion_trial(
        seed: int,
        selector_mask: nk.assets.Image,
        video: nk.assets.Video,
        correct_answer: bool, # yes / no
        prompt: str = 'Will the red object touch the yellow object?'
) -> nk.Graph:
    gen = random.Random(seed)

    fixation_node = nk.Node(
        cards={
            'fixation-cross': nk.cards.TextCard(text='+', font_size=0.02, x=0, y=0, w=0.05, h=0.05),
        },
        sensors={
            'fixated': nk.sensors.TimeoutSensor(
                timeout_msec = int(gen.random() * 1000 + 500)
            )
        }
    )

    video_card = nk.cards.VideoCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        z_index=1,
        video=video,
    )
    mask = nk.cards.ImageCard(
        x=video_card.x,
        y=video_card.y,
        w=video_card.w,
        h=video_card.h,
        z_index=10,
        image=selector_mask,
    )
    main_node = nk.Node(
        cards={
            'mask': mask,
            'video': video_card,

        },
        sensors={
            'fixated': nk.sensors.TimeoutSensor(
                timeout_msec=60000
            )
        }
    )

    return nk.Graph(
        nodes={
            'fixation': fixation_node,
            'main': main_node,
        },
        start='fixation',
        transitions = {
            'fixation': {'fixated':'main'}
        }
    )


# %%
if __name__ == '__main__':

    video = nk.assets.Video.from_path('./stimuli/pilot_dominoes_2mid_J020R15_d3chairs_o1plants_tdwroom_2-redyellow_0024_img.mp4')
    image_mask  = nk.assets.Image.from_path('./stimuli/pilot_dominoes_2mid_J020R15_d3chairs_o1plants_tdwroom_2_0024_map.png')

    trial = make_physion_trial(
        seed=0,
        selector_mask=image_mask,
        video=video,
        correct_answer=False,
    )

    trace = nk.play(trial)