mod error;
mod md;

use crate::md::{FONT_METRICS, parse};
use cosmic_text::fontdb::{ID, Source};
use cosmic_text::{
    Align, Attrs, AttrsOwned, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache,
};
pub use error::Error;
use std::fmt::Alignment;
use std::sync::Arc;

pub struct Text {
    font_system: FontSystem,
    swash_cache: SwashCache,
    regular: String,
    italic: String,
}

impl Text {
    // TODO vertical alignment.
    pub fn render(&mut self, text: &str, w: f32, h: f32, alignment: Align) -> Result<(), Error> {
        let mut buffer = Buffer::new(&mut self.font_system, FONT_METRICS);
        let mut buffer = buffer.borrow_with(&mut self.font_system);
        buffer.set_size(Some(w), Some(h));

        let mut attrs = Attrs::new();
        attrs.family = Family::SansSerif;
        attrs.metrics_opt = Some(FONT_METRICS.into());
        let paragraphs = parse(text, attrs.clone())?;
        let len = paragraphs.len();
        for (i, paragraph) in paragraphs.into_iter().enumerate() {
            // Set the metrics of this paragraph.
            buffer.set_metrics(paragraph.metrics);
            // Shape the text.
            buffer.set_rich_text(
                paragraph.spans
                    .into_iter()
                    .map(|span| (span.text.as_str(), span.attrs)),
                &attrs,
                Shaping::Advanced,
                Some(alignment),
            );
            buffer.shape_until_scroll(true);
            // Empty line.
            if len > 1 && i < len - 1{
                buffer.set_metrics(FONT_METRICS);
                buffer.set_text("\n\n", &attrs, Shaping::Advanced,
                                Some(alignment));
            }
            buffer.shape_until_scroll(true);
        }


        buffer.draw(
            &mut self.swash_cache,
            Color::rgb(0, 0, 0),
            |x, y, w, h, color| {
                // Fill in your code here for drawing rectangles
            },
        );
    }
}

impl Default for Text {
    fn default() -> Self {
        let mut font_system = FontSystem::new();
        let regular = font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-VariableFont_opsz,wght.ttf"
            ))))[0];
        let italic = font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf"
            ))))[0];
        let regular = font_system.db().face(regular).unwrap().families[0]
            .0
            .clone();
        let italic = font_system.db().face(italic).unwrap().families[0].0.clone();
        let swash_cache = SwashCache::new();
        Self {
            font_system,
            swash_cache,
            regular,
            italic,
        }
    }
}
