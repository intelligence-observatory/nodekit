use cosmic_text::Attrs;

#[derive(Clone)]
pub struct Span<'s> {
    pub text: String,
    pub attrs: Attrs<'s>,
}
