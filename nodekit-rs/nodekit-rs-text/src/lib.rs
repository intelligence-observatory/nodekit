mod error;
mod md;
mod surface;

use blittle::{PositionI, Size, clip, blit};
use bytemuck::cast_slice_mut;
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache};
pub use error::Error;
use md::{FontSize, parse};
use nodekit_rs_models::{Card, JustificationHorizontal, JustificationVertical, Rect};
use nodekit_rs_visual::{BOARD_D_F64, BlitRect, STRIDE, bitmap, overlay, overlay_pixel, parse_color, BOARD_SIZE};
use std::sync::Arc;
use surface::Surface;

pub struct Text {
    font_system: FontSystem,
    swash_cache: SwashCache,
}

impl Text {
    pub fn blit(&mut self, card: &Card, text: &nodekit_rs_models::Text, board: &mut [u8]) -> Result<(), Error> {
        let src = self.render(card.rect, text)?;
        // Blit it.
        let blit_rect = BlitRect::from(card.rect);
        blit(
            &src,
            &blit_rect.size,
            board,
            &blit_rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
        Ok(())
    }
    
    pub fn render(&mut self, rect: Rect, text: &nodekit_rs_models::Text) -> Result<Vec<u8>, Error> {
        // Get the font sizes.
        let font_size = FontSize::new((text.font_size * BOARD_D_F64).ceil() as u16);
        let mut buffer = Buffer::new(&mut self.font_system, Metrics::from(&font_size));
        let font_usize = font_size.font_size as usize;
        let line_height_isize = font_size.line_height as isize;
        let blit_rect = BlitRect::from(rect);
        let w = blit_rect.size.w - font_usize * 2;
        let h = blit_rect.size.h - font_usize * 2;
        let src_size = Size { w, h };
        buffer.set_size(&mut self.font_system, Some(w as f32), Some(h as f32));

        let text_color = parse_color(&text.text_color).map_err(Error::Visual)?;
        let text_color = Color::rgba(text_color[0], text_color[1], text_color[2], text_color[3]);
        let mut attrs = Attrs::new().color(text_color);
        attrs.family = Family::SansSerif;
        let paragraphs = parse(&text.text, &font_size, attrs.clone())?;
        let mut y = 0;
        let mut surfaces = Vec::default();
        let background_color = parse_color(&text.background_color).map_err(Error::Visual)?;

        for paragraph in paragraphs {
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
                Some(Self::get_align(text.justification_horizontal)),
            );
            buffer.shape_until_scroll(&mut self.font_system, true);

            // Get the total rendered height.
            let height = (buffer
                .layout_runs()
                .map(|layout| layout.line_height)
                .sum::<f32>()
                * 1.2) as usize;

            // Create an empty surface.
            let mut surface = bitmap(src_size.w, src_size.h, background_color);
            // Draw.
            self.draw(text_color, src_size, &mut surface, &mut buffer);
            // Store.
            surfaces.push(Surface {
                surface,
                y,
                size: src_size,
            });

            // Update y
            y += height.cast_signed() + line_height_isize;
        }

        // The total height.
        let height = y - line_height_isize;
        let y_offset = match text.justification_vertical {
            JustificationVertical::Top => 0,
            JustificationVertical::Center => blit_rect.size.h.cast_signed() / 2 - height / 2,
            JustificationVertical::Bottom => blit_rect.size.h.cast_signed() - height,
        } + line_height_isize;

        // Blit onto the final surface.
        let mut final_surface = bitmap(blit_rect.size.w, blit_rect.size.h, background_color);
        for surface in surfaces {
            let position = PositionI {
                x: 0,
                y: surface.y + y_offset,
            };
            let mut src_size = surface.size;
            let mut position = clip(&position, &blit_rect.size, &mut src_size);
            position.x = font_usize;
            overlay(
                &surface.surface,
                &src_size,
                &mut final_surface,
                &position,
                &blit_rect.size,
            );
        }

        Ok(final_surface)
    }

    fn draw(&mut self, text_color: Color, size: Size, surface: &mut [u8], buffer: &mut Buffer) {
        let dst = cast_slice_mut::<u8, [u8; STRIDE]>(surface);
        buffer.draw(
            &mut self.font_system,
            &mut self.swash_cache,
            text_color,
            |x, y, w, h, color| {
                let x1 = (x as usize + w as usize).min(size.w);
                let y1 = (y as usize + h as usize).min(size.h);
                let alpha = color.a();
                if alpha > 0 {
                    (x as usize..x1).zip(y as usize..y1).for_each(|(x, y)| {
                        let index = x + y * size.w;
                        overlay_pixel(&color.as_rgba(), &mut dst[index]);
                    });
                }
            },
        )
    }

    const fn get_align(justification: JustificationHorizontal) -> Align {
        match justification {
            JustificationHorizontal::Left => Align::Left,
            JustificationHorizontal::Center => Align::Center,
            JustificationHorizontal::Right => Align::Right,
        }
    }
}

impl Default for Text {
    fn default() -> Self {
        let mut font_system = FontSystem::new();
        font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-VariableFont_opsz,wght.ttf"
            ))));
        font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf"
            ))));
        let swash_cache = SwashCache::new();
        Self {
            font_system,
            swash_cache,
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
        let width = 768;
        let height = 768;

        let card = nodekit_rs_models::Text {
            text: include_str!("../lorem.txt").to_string(),
            font_size: 0.02,
            justification_horizontal: JustificationHorizontal::Left,
            justification_vertical: JustificationVertical::Center,
            text_color: "#000000FF".to_string(),
            background_color: "#AAAAAAFF".to_string(),
        };
        let rect = Rect {
            position: nodekit_rs_models::Position { x: -0.5, y: -0.5 },
            size: nodekit_rs_models::Size { w: 1., h: 1. },
        };

        // Render the text.
        let mut text = Text::default();
        let image = text.render(rect, &card).unwrap();

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
