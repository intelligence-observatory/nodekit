use crate::fb_enum;

fb_enum!(
    JustificationHorizontal,
    "horizontal justification",
    Left,
    Center,
    Right
);
fb_enum!(
    JustificationVertical,
    "vertical justification",
    Top,
    Center,
    Bottom
);

pub struct Text {
    pub text: String,
    pub font_size: u16,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
}

impl<'t> From<nodekit_rs_fb::Text<'t>> for Text {
    fn from(value: nodekit_rs_fb::Text) -> Self {
        Self {
            text: value.text().unwrap_or_default().to_string(),
            font_size: value.font_size() as u16,
            justification_horizontal: value.justification_horizontal().into(),
            justification_vertical: value.justification_vertical().into(),
        }
    }
}
