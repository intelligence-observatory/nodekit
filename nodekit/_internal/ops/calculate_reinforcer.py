from nodekit._internal.types.reinforcer_maps.reinforcer_maps import Reinforcer, ReinforcerMap
from nodekit._internal.types.actions.actions import Action

def evaluate_reinforcer_map(
        action: Action,
        reinforcer_map: ReinforcerMap,
) -> Reinforcer:
    ...