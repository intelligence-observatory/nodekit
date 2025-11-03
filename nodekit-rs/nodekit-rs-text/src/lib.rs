mod error;
mod md;

use crate::md::{FONT_METRICS, LINE_HEIGHT_ISIZE, parse};
use blittle::stride::RGB;
use blittle::{PositionI, Size, blit, clip};
use bytemuck::cast_slice_mut;
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
        let mut final_surface = Self::get_surface(size, background_color);

        let mut buffer = Buffer::new(&mut self.font_system, FONT_METRICS);
        buffer.set_size(
            &mut self.font_system,
            Some(size.w as f32),
            Some(size.h as f32),
        );

        let mut attrs = Attrs::new();
        attrs.family = Family::SansSerif;
        let paragraphs = parse(text, attrs.clone())?;
        let mut position = PositionI { x: 0, y: 0 };
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

            // Get the total rendered height.
            let height = buffer
                .layout_runs()
                .map(|layout| layout.line_height)
                .sum::<f32>() as usize;

            // Create an empty surface.
            let mut src_size = Size {
                w: size.w,
                h: height,
            };
            let mut surface = Self::get_surface(src_size, background_color);

            // Draw.
            self.draw(src_size, &mut surface, &mut buffer);

            // Blit onto the final surface.
            let position_u = clip(&position, &size, &mut src_size);
            blit(
                &surface,
                &src_size,
                &mut final_surface,
                &position_u,
                &size,
                RGB,
            );

            // Update y
            position.y += height as isize + LINE_HEIGHT_ISIZE;
        }

        Ok(final_surface)
    }

    fn get_surface(size: Size, color: [u8; 3]) -> Vec<u8> {
        let mut surface = vec![0; size.w * size.h * RGB];
        // Fill the surface.
        cast_slice_mut::<u8, [u8; 3]>(&mut surface).copy_from_slice(&vec![color; size.w * size.h]);
        surface
    }

    fn draw(&mut self, size: Size, surface: &mut [u8], buffer: &mut Buffer) {
        buffer.draw(
            &mut self.font_system,
            &mut self.swash_cache,
            Color::rgb(0, 0, 0),
            |x, y, w, h, color| {
                let x1 = (x as usize + w as usize).min(size.w);
                let y1 = (y as usize + h as usize).min(size.h);
                let dst = cast_slice_mut::<u8, [u8; 3]>(surface);
                let alpha = color.a();
                if alpha > 0 {
                    let alpha = alpha as f64 / 255.;
                    (x as usize..x1).zip(y as usize..y1).for_each(|(x, y)| {
                        let index = x + y * size.w;
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
                Size {
                    w: width,
                    h: height,
                },
                Align::Left,
                [200, 200, 200],
            )
            .unwrap();

        // Write the result as a .png file.
        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder = png::Encoder::new(w, width as u32, height as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(&image).unwrap();
    }
}
