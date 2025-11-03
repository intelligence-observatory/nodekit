use super::{FONT_METRICS, Span, list_state::ListState};
use cosmic_text::Metrics;

#[derive(Clone)]
pub struct Paragraph<'s> {
    pub metrics: Metrics,
    pub spans: Vec<Span<'s>>,
    pub list_states: Option<Vec<ListState>>,
}

impl Default for Paragraph<'_> {
    fn default() -> Self {
        Self {
            metrics: FONT_METRICS,
            spans: Vec::default(),
            list_states: None,
        }
    }
}
