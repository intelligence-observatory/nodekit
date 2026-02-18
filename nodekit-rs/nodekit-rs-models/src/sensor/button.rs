use crate::card::CardKey;
use crate::sensor::error::ButtonStateError;
use std::str::FromStr;

#[derive(Copy, Clone, Eq, PartialEq)]
pub enum ButtonState {
    Disabled,
    Enabled,
    Hovering,
}

impl FromStr for ButtonState {
    type Err = ButtonStateError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "enabled" => Ok(Self::Enabled),
            "disabled" => Ok(Self::Disabled),
            "hovering" => Ok(Self::Hovering),
            other => Err(ButtonStateError(other.to_string())),
        }
    }
}

/// A button can be enabled, disabled, and hovered over.
pub struct Button {
    pub cards: Vec<CardKey>,
    pub state: ButtonState,
}

impl Button {
    pub const fn new(cards: Vec<CardKey>) -> Self {
        Self {
            cards,
            state: ButtonState::Disabled,
        }
    }
}
