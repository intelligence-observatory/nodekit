use cosmic_text::Align;

#[derive(Copy, Clone, Default)]
pub enum JustificationHorizontal {
    #[default]
    Left,
    Center,
    Right,
}

impl Into<Align> for JustificationHorizontal {
    fn into(self) -> Align {
        match self {
            Self::Left => Align::Left,
            Self::Center => Align::Center,
            Self::Right => Align::Right,
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
