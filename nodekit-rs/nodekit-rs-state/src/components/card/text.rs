use slotmap::new_key_type;

new_key_type! { pub struct TextKey; }

#[derive(Default)]
pub enum JustificationHorizontal {
    #[default]
    Left,
    Center,
    Right,
}

#[derive(Default)]
pub enum JustificationVertical {
    #[default]
    Top,
    Center,
    Bottom,
}

#[derive(Default)]
pub struct Text {
    pub text: String,
    pub font_size: u16,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
}
