use super::{FONT_METRICS, Span};
use cosmic_text::Metrics;

#[derive(Clone)]
pub struct Paragraph<'s> {
    pub metrics: Metrics,
    pub spans: Vec<Span<'s>>,
}

impl Default for Paragraph<'_> {
    fn default() -> Self {
        Self {
            metrics: FONT_METRICS,
            spans: Vec::default(),
        }
    }
}
