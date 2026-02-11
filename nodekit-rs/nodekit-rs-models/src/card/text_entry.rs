#[derive(Copy, Clone)]
pub enum TextEntryGutterState {
    Disabled,
    Enabled,
    Hovering
}

pub struct TextEntry {
    pub prompt: String,
    pub font_size: i64,
    pub text: String,
    pub state: TextEntryGutterState,
}
