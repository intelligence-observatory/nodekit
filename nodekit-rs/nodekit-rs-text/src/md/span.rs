use crate::md::Style;

/// A vec of words derived from a Markdown string.
pub struct Span {
    pub text: Option<String>,
    pub style: Style,
}
