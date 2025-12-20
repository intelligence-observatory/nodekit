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
        _require_action_type(sensor, action, WaitAction)
        return

    if isinstance(sensor, KeySensor):
        _require_action_type(sensor, action, KeyAction)
        if action.action_value not in sensor.keys:
            raise ValueError(f"KeyAction key '{action.action_value}' not in sensor keys.")
        return

    if isinstance(sensor, SelectSensor):
        _require_action_type(sensor, action, SelectAction)
        if action.action_value not in sensor.choices:
            raise ValueError(f"SelectAction choice '{action.action_value}' not in sensor choices.")
        return

    if isinstance(sensor, MultiSelectSensor):
        _require_action_type(sensor, action, MultiSelectAction)
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

    if isinstance(sensor, TextEntrySensor):
        _require_action_type(sensor, action, TextEntryAction)
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

    if isinstance(sensor, SliderSensor):
        _require_action_type(sensor, action, SliderAction)
        value = action.action_value
        if value < 0 or value >= sensor.num_bins:
            raise ValueError(f"SliderAction bin {value} out of range [0, {sensor.num_bins - 1}].")
        return

    if isinstance(sensor, ProductSensor):
        _require_action_type(sensor, action, ProductAction)
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

    if isinstance(sensor, SumSensor):
        _require_action_type(sensor, action, SumAction)
        child_id, child_action = action.action_value
        if child_id not in sensor.children:
            raise ValueError(f"SumAction child_id '{child_id}' not in sensor children.")
        validate_action(sensor.children[child_id], child_action)
        return

    _: Never = sensor
    raise TypeError(f"Unsupported sensor type: {type(sensor)}")


# %% Helpers
def _require_action_type(sensor: Sensor, action: Action, expected_type: type[Action]) -> None:
    if not isinstance(action, expected_type):
        raise ValueError(
            f"Action {type(action).__name__} is not valid for {type(sensor).__name__}."
        )
