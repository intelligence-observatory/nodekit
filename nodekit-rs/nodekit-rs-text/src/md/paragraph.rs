use super::{FontSize, Span};
use crate::Error;
use cosmic_text::Metrics;

#[derive(Clone)]
pub struct Paragraph<'s> {
    pub metrics: Metrics,
    pub spans: Vec<Span<'s>>,
    pub spacing: usize,
}

impl Paragraph<'_> {
    pub const fn text(font_size: &FontSize) -> Self {
        Self {
            metrics: Metrics {
                font_size: font_size.font_size,
                line_height: font_size.line_height,
            },
            spans: Vec::new(),
            spacing: font_size.line_height as usize,
        }
    }

    pub fn header(depth: u8, font_size: &FontSize) -> Result<Self, Error> {
        let metrics = font_size.header_metrics(depth)?;
        Ok(Self {
            metrics,
            spans: Vec::new(),
            spacing: metrics.line_height as usize,
        })
    }

    pub const fn list_item(&mut self, font_size: &FontSize) {
        self.metrics = Metrics {
            font_size: font_size.font_size,
            line_height: font_size.font_size,
        };
        self.spacing = 0;
    }
}
