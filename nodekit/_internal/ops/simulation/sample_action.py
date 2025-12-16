import nodekit._internal.types.sensors as s
import nodekit._internal.types.actions as a
from random import Random
from typing import Never

def sample_action(
        sensor: s.Sensor,
        rng: Random | None = None
) -> a.Action:
    """
    Randomly sample an Action from the given Sensor.
    Useful for simulating Participant behavior.

    Args:
        sensor:
        rng: random.Random instance to use for sampling. If None, an unseeded instance will be used.

    Returns:

    """

    if rng is None:
        rng = Random()

    match sensor:
        case s.WaitSensor():
            return a.WaitAction()
        case s.KeySensor():
            selected_key = rng.choice(sorted(sensor.keys))
            return a.KeyAction(action_value=selected_key)
        case s.SelectSensor():
            choice_ids = sorted(sensor.choices.keys())
            selected_id = rng.choice(choice_ids)

            return a.SelectAction(action_value=selected_id)
        case s.MultiSelectSensor():
            choice_ids = sorted(sensor.choices.keys())
            min_selections = sensor.min_selections
            max_selections = sensor.max_selections or len(choice_ids)
            num_selections = rng.randint(min_selections, max_selections)
            selected_ids = rng.sample(population=choice_ids, k=num_selections)
            return a.MultiSelectAction(action_value=selected_ids)
        case s.TextEntrySensor():
            min_length = sensor.min_length
            max_length = sensor.max_length or (min_length + 100)
            response_length = rng.randint(min_length, max_length)
            # Generate a random string of the specified length
            random_string = ''.join(rng.choices(
                population=(
                    'abcdefghijklmnopqrstuvwxyz'
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                    '0123456789'
                    '.,!?;:()-_ '
                ),
                k=response_length)
            )
            return a.TextEntryAction(action_value=random_string)
        case s.SliderSensor():
            num_bins = sensor.num_bins
            selected_bin = rng.randint(0, num_bins - 1)
            return a.SliderAction(action_value=selected_bin)
        case s.ProductSensor():
            action_value = {
                child_id: sample_action(sensor=sensor[child_id], rng=rng) for child_id in sorted(sensor.children.keys())
            }
            return a.ProductAction(action_value=action_value)
        case s.SumSensor():
            child_ids = sorted(sensor.children.keys())
            selected_child_id = rng.choice(child_ids)
            child_sensor = sensor.children[selected_child_id]
            child_action = sample_action(sensor=child_sensor, rng=rng)
            return a.SumAction(action_value=(selected_child_id, child_action))
        case _:
            _: Never = None
            raise NotImplementedError(f"Sampling not implemented for sensor type: {type(sensor)}")