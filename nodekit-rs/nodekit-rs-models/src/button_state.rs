#[derive(Copy, Clone, Debug)]
pub enum ButtonState {
    Disabled,
    Enabled,
    /// Enabled and hovering.
    Hovering
}

impl ButtonState {
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "disabled" => Some(Self::Disabled),
            "enabled" => Some(Self::Enabled),
            "hovering" => Some(Self::Hovering),
            _ => None
        }
    }
}