use cosmic_text::{Attrs, AttrsOwned};

pub struct Span<'s> {
    pub text: String,
    pub attrs: Attrs<'s>,
}
