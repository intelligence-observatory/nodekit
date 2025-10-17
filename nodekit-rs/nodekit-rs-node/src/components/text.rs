macro_rules! justification {
    ($name:ident, $one:ident, $two:ident) => {
        pub enum $name {
            $one,
            Center,
            $two,
        }

        impl From<nodekit_rs_fb::$name> for $name {
            fn from(value: nodekit_rs_fb::$name) -> Self {
                match value {
                    nodekit_rs_fb::$name::$one => Self::$one,
                    nodekit_rs_fb::$name::Center => Self::Center,
                    nodekit_rs_fb::$name::$two => Self::$two,
                    other => unreachable!("Invalid justification: {}", other.0),
                }
            }
        }
    };
}

justification!(JustificationHorizontal, Left, Right);
justification!(JustificationVertical, Top, Bottom);

pub struct Text {
    pub text: String,
    pub font_size: u16,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
}

impl<'t> From<nodekit_rs_fb::Text<'t>> for Text {
    fn from(value: nodekit_rs_fb::Text) -> Self {
        Self {
            text: value.text().unwrap_or(Default::default()).to_string(),
            font_size: value.font_size() as u16,
            justification_horizontal: value.justification_horizontal().into(),
            justification_vertical: value.justification_vertical().into(),
        }
    }
}
