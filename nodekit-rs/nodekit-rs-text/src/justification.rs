use cosmic_text::Align;

#[derive(Copy, Clone, Default)]
pub struct Justification {
    pub horizontal: JustificationHorizontal,
    pub vertical: JustificationVertical,
}

#[derive(Copy, Clone, Default)]
pub enum JustificationHorizontal {
    #[default]
    Left,
    Center,
    Right,
}

impl From<JustificationHorizontal> for Align {
    fn from(value: JustificationHorizontal) -> Self {
        match value {
            JustificationHorizontal::Left => Self::Left,
            JustificationHorizontal::Center => Self::Center,
            JustificationHorizontal::Right => Self::Right,
        }
    }
}

#[derive(Copy, Clone, Default)]
pub enum JustificationVertical {
    #[default]
    Top,
    Center,
    Bottom,
}
