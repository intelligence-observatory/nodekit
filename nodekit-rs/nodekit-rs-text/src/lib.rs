mod error;
mod md;

use crate::md::{FONT_METRICS, parse};
use bytemuck::cast_slice_mut;
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Shaping, SwashCache};
pub use error::Error;
use std::sync::Arc;

const RGBA: usize = 4;

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
        width: usize,
        height: usize,
        alignment: Align,
        background_color: [u8; 3],
    ) -> Result<Vec<u8>, Error> {
        // Create an empty surface.
        let mut surface = vec![0; width * height * RGBA];
        // Cast to u32 (RGBA).
        let color = u32::from_le_bytes([
            background_color[0],
            background_color[1],
            background_color[2],
            255,
        ]);
        // Fill the surface.
        for pixel in cast_slice_mut::<u8, u32>(&mut surface) {
            *pixel = color;
        }

        let mut buffer = Buffer::new(&mut self.font_system, FONT_METRICS);
        buffer.set_size(&mut self.font_system, Some(width as f32), Some(height as f32));

        let mut attrs = Attrs::new();
        attrs.family = Family::SansSerif;
        let paragraphs = parse(text, attrs.clone())?;
        let len = paragraphs.len();
        // TODO list
        for (i, paragraph) in paragraphs.into_iter().enumerate() {
            // Set the metrics of this paragraph.
            buffer.set_metrics(&mut self.font_system, paragraph.metrics);
            // Shape the text.
            buffer.set_rich_text(
                &mut self.font_system,
                paragraph
                    .spans
                    .iter()
                    .map(|span| (span.text.as_str(), span.attrs.clone())),
                &attrs,
                Shaping::Advanced,
                Some(alignment),
            );
            buffer.shape_until_scroll(&mut self.font_system, true);
            // Empty line.
            if len > 1 && i < len - 1 {
                buffer.set_metrics(&mut self.font_system, FONT_METRICS);
                buffer.set_text(&mut self.font_system, "\n\n", &attrs, Shaping::Advanced, Some(alignment));
            }
            buffer.shape_until_scroll(&mut self.font_system, true);
            // Draw.
            self.draw(width, height, &mut surface, &mut buffer);
        }

        Ok(surface)
    }

    fn draw(&mut self, width: usize, height: usize, surface: &mut [u8], buffer: &mut Buffer) {
        buffer.draw(
            &mut self.font_system,
            &mut self.swash_cache,
            Color::rgb(0, 0, 0),
            |x, y, w, h, color| {
                let x1 = (x as usize + w as usize).min(width);
                let y1 = (y as usize + h as usize).min(height);
                let dst = cast_slice_mut::<u8, [u8; 4]>(surface);
                let alpha = color.a();
                if alpha > 0 {
                    let alpha = alpha as f64 / 255.;
                    (x as usize..x1).zip(y as usize..y1).for_each(|(x, y)| {
                        let index = x + y * width;
                        dst[index]
                            .iter_mut()
                            .zip(color.as_rgba())
                            .for_each(|(below, above)| {
                                // Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors/
                                let result = *below as f64 * (1. - alpha) + above as f64 * alpha;
                                *below = result.round() as u8
                            });
                    });
                }
            },
        )
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_text_render() {
        let width = 1024;
        let height = 768;

        // Render the text.
        let mut text = Text::default();
        let image = text
            .render(
                include_str!("../lorem.txt"),
                width,
                height,
                Align::Left,
                [200, 200, 200],
            )
            .unwrap();

        // Write the result as a .png file.
        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder = png::Encoder::new(w, width as u32, height as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgba);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(&image).unwrap();
    }
}
