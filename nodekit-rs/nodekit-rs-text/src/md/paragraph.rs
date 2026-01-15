use super::paragraph_type::ParagraphType;
use super::{FontSize, Span};
use cosmic_text::Metrics;

#[derive(Clone)]
pub struct Paragraph<'s> {
    pub metrics: Metrics,
    pub spans: Vec<Span<'s>>,
    pub paragraph_type: ParagraphType,
}

impl From<&FontSize> for Paragraph<'_> {
    fn from(value: &FontSize) -> Self {
        Self {
            metrics: Metrics::from(value),
            spans: Vec::default(),
            paragraph_type: ParagraphType::Text,
        }
    }
}
