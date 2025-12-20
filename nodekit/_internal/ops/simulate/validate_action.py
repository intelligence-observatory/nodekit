from typing import Never

# %% Imports
from nodekit._internal.types.actions import (
    Action,
    KeyAction,
    MultiSelectAction,
    ProductAction,
    SelectAction,
    SliderAction,
    SumAction,
    TextEntryAction,
    WaitAction,
)
from nodekit._internal.types.sensors import (
    KeySensor,
    MultiSelectSensor,
    ProductSensor,
    SelectSensor,
    Sensor,
    SliderSensor,
    SumSensor,
    TextEntrySensor,
    WaitSensor,
)


# %% Public API
def validate_action(sensor: Sensor, action: Action) -> None:
    """
    Validates that the Action is compatible with the given Sensor.
    Raises ValueError on mismatch.
    """
    if isinstance(sensor, WaitSensor):
        if not isinstance(action, WaitAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        return

    elif isinstance(sensor, KeySensor):
        if not isinstance(action, KeyAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        if action.action_value not in sensor.keys:
            raise ValueError(f"KeyAction key '{action.action_value}' not in sensor keys.")
        return

    elif isinstance(sensor, SelectSensor):
        if not isinstance(action, SelectAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        if action.action_value not in sensor.choices:
            raise ValueError(f"SelectAction choice '{action.action_value}' not in sensor choices.")
        return

    elif isinstance(sensor, MultiSelectSensor):
        if not isinstance(action, MultiSelectAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        selections = action.action_value
        unique = set(selections)
        if len(unique) != len(selections):
            raise ValueError("MultiSelectAction selections must be unique.")
        unknown = unique - set(sensor.choices.keys())
        if unknown:
            raise ValueError(f"MultiSelectAction selections not in choices: {sorted(unknown)}")
        max_selections = (
            sensor.max_selections if sensor.max_selections is not None else len(sensor.choices)
        )
        if len(selections) < sensor.min_selections or len(selections) > max_selections:
            raise ValueError(
                "MultiSelectAction selections count must be within "
                f"[{sensor.min_selections}, {max_selections}]."
            )
        return

    elif isinstance(sensor, TextEntrySensor):
        if not isinstance(action, TextEntryAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        length = len(action.action_value)
        if length < sensor.min_length:
            raise ValueError(
                f"TextEntryAction length {length} is below min_length {sensor.min_length}."
            )
        if sensor.max_length is not None and length > sensor.max_length:
            raise ValueError(
                f"TextEntryAction length {length} exceeds max_length {sensor.max_length}."
            )
        return

    elif isinstance(sensor, SliderSensor):
        if not isinstance(action, SliderAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        value = action.action_value
        if value < 0 or value >= sensor.num_bins:
            raise ValueError(f"SliderAction bin {value} out of range [0, {sensor.num_bins - 1}].")
        return

    elif isinstance(sensor, ProductSensor):
        if not isinstance(action, ProductAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        action_map = action.action_value
        expected_keys = set(sensor.children.keys())
        provided_keys = set(action_map.keys())
        if expected_keys != provided_keys:
            missing = sorted(expected_keys - provided_keys)
            extra = sorted(provided_keys - expected_keys)
            raise ValueError(
                "ProductAction keys must match sensor children. "
                f"Missing: {missing}, extra: {extra}."
            )
        for child_id, child_action in action_map.items():
            validate_action(sensor.children[child_id], child_action)
        return

    elif isinstance(sensor, SumSensor):
        if not isinstance(action, SumAction):
            raise ValueError(
                f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
            )
        child_id, child_action = action.action_value
        if child_id not in sensor.children:
            raise ValueError(f"SumAction child_id '{child_id}' not in sensor children.")
        validate_action(sensor.children[child_id], child_action)
        return
    else:
        _: Never = sensor
        raise TypeError(f"Unsupported sensor type: {type(sensor)}")
