use nodekit_rs_text::{JustificationHorizontal, JustificationVertical};
use slotmap::new_key_type;

new_key_type! { pub struct TextKey; }

#[derive(Default)]
pub struct Text {
    pub text: String,
    pub font_size: u16,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
}
