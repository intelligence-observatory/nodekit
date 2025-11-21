mod error;
mod md;
mod surface;

use blittle::stride::RGBA;
use blittle::{PositionI, Size};
use bytemuck::cast_slice_mut;
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache};
pub use error::Error;
use md::{FontSize, parse};
use nodekit_rs_models::{JustificationHorizontal, JustificationVertical, Rect};
use nodekit_rs_visual::{
    BOARD_D_F64, ResizedRect, RgbaBuffer, RgbaRects, bitmap_rgba, parse_color_rgba,
    spatial_coordinate, to_blittle_size,
};
use pyo3::pyclass;
use std::sync::Arc;
use surface::Surface;

#[pyclass]
pub struct TextEngine {
    font_system: FontSystem,
    swash_cache: SwashCache,
}

impl TextEngine {
    pub fn render(
        &mut self,
        rect: Rect,
        text: &nodekit_rs_models::Text,
    ) -> Result<Vec<RgbaBuffer>, Error> {
        // Get the font sizes.
        let font_size = FontSize::new((text.font_size * BOARD_D_F64).ceil() as u16);
        let mut buffer = Buffer::new(&mut self.font_system, Metrics::from(&font_size));
        let font_usize = font_size.font_size as usize;
        let font_isize = font_size.font_size as isize;
        let line_height_isize = font_size.line_height as isize;
        let src_size = to_blittle_size(&rect.size);
        buffer.set_size(
            &mut self.font_system,
            Some((src_size.w - font_usize * 2) as f32),
            Some((src_size.h - font_usize * 2) as f32),
        );

        let text_color = parse_color_rgba(&text.text_color).map_err(Error::Visual)?;
        let text_color = Color::rgba(text_color[0], text_color[1], text_color[2], 255);
        let mut attrs = Attrs::new().color(text_color);
        attrs.family = Family::SansSerif;
        let paragraphs = parse(&text.text, &font_size, attrs.clone())?;
        let mut y = 0;
        let mut surfaces = Vec::default();
        let background_color = parse_color_rgba(&text.background_color).map_err(Error::Visual)?;

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
            let mut surface = bitmap_rgba(src_size.w, src_size.h, background_color);
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
            JustificationVertical::Center => src_size.h.cast_signed() / 2 - height / 2,
            JustificationVertical::Bottom => src_size.h.cast_signed() - height,
        } + line_height_isize;

        let offset = PositionI {
            x: spatial_coordinate(rect.position.x),
            y: spatial_coordinate(rect.position.y),
        };
        // Blit onto the final surface.
        Ok(surfaces
            .into_iter()
            .filter_map(|surface| {
                let position = PositionI {
                    x: offset.x - font_isize,
                    y: offset.y + surface.y + y_offset,
                };
                let mut surface_size = surface.size;
                surface_size.w -= font_usize * 2;
                RgbaRects::new(&ResizedRect {
                    position,
                    size: surface_size,
                })
                .map(|rects| RgbaBuffer {
                    buffer: surface.surface,
                    rects,
                })
            })
            .collect())
    }

    fn draw(&mut self, text_color: Color, size: Size, surface: &mut [u8], buffer: &mut Buffer) {
        let dst = cast_slice_mut::<u8, [u8; RGBA]>(surface);
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
                        RgbaBuffer::overlay_pixel_rgba(&color.as_rgba(), &mut dst[index]);
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

impl Default for TextEngine {
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
    use nodekit_rs_visual::{BOARD_D_U32, board};
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_text_render() {
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
        let mut text = TextEngine::default();
        let mut board = board([200, 200, 200]);
        for buffer in text.render(rect, &card).unwrap() {
            buffer.blit(&mut board);
        }

        // Write the result as a .png file.
        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder = png::Encoder::new(w, BOARD_D_U32, BOARD_D_U32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(&board).unwrap();
    }
}
