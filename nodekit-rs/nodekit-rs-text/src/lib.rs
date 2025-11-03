mod error;
mod md;

use crate::md::{FONT_METRICS, parse};
use blittle::{PositionI, Size, blit, clip, stride::RGB};
use bytemuck::{cast_slice, cast_slice_mut};
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Shaping, SwashCache};
pub use error::Error;
use std::sync::Arc;

pub struct Text {
    font_system: FontSystem,
    swash_cache: SwashCache,
    regular: String,
    italic: String,
}

impl Text {
    // TODO vertical alignment.
    pub fn render(
        &mut self,
        text: &str,
        size: Size,
        alignment: Align,
        background_color: [u8; 3],
    ) -> Result<Vec<u8>, Error> {
        // Create an empty surface.
        let mut surface = vec![0; size.w * size.h * RGB];
        // Fill the surface.
        cast_slice_mut::<u8, [u8; 3]>(&mut surface)
            .iter_mut()
            .for_each(|pixel| {
                pixel[0] = background_color[0];
                pixel[1] = background_color[1];
                pixel[2] = background_color[2];
            });

        let mut buffer = Buffer::new(&mut self.font_system, FONT_METRICS);
        let mut buffer = buffer.borrow_with(&mut self.font_system);
        buffer.set_size(Some(size.w as f32), Some(size.h as f32));

        let mut attrs = Attrs::new();
        attrs.family = Family::SansSerif;
        attrs.metrics_opt = Some(FONT_METRICS.into());
        let paragraphs = parse(text, attrs.clone())?;
        let len = paragraphs.len();
        // TODO list
        for (i, paragraph) in paragraphs.into_iter().enumerate() {
            // Set the metrics of this paragraph.
            buffer.set_metrics(paragraph.metrics);
            // Shape the text.
            buffer.set_rich_text(
                paragraph
                    .spans
                    .iter()
                    .map(|span| (span.text.as_str(), span.attrs.clone())),
                &attrs,
                Shaping::Advanced,
                Some(alignment),
            );
            buffer.shape_until_scroll(true);
            // Empty line.
            if len > 1 && i < len - 1 {
                buffer.set_metrics(FONT_METRICS);
                buffer.set_text("\n\n", &attrs, Shaping::Advanced, Some(alignment));
            }
            buffer.shape_until_scroll(true);
        }
        // Update max y.
        let mut max_y = 0;
        // Draw.
        buffer.draw(
            &mut self.swash_cache,
            Color::rgb(0, 0, 0),
            |x, y, w, h, _| {
                let w = w as usize;
                let h = h as usize;
                // Create the base image.
                let src = vec![background_color; w * h];
                let position = PositionI {
                    x: x as isize,
                    y: y as isize,
                };
                let mut src_size = Size { w, h };
                // Clip and blit.
                let position = clip(&position, &size, &mut src_size);
                blit(
                    cast_slice::<[u8; 3], u8>(&src),
                    &src_size,
                    &mut surface,
                    &position,
                    &size,
                    RGB,
                );
                // Update the max y.
                max_y = max_y.max((position.y + h).min(size.h));
            },
        );

        Ok(surface)
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
