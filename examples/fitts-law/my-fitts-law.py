import nodekit as nk
from typing import Tuple

def make_fitts_trial(
    home_position: Tuple[float, float],
    target_position: Tuple[float, float],
) -> nk.Graph:
    ...