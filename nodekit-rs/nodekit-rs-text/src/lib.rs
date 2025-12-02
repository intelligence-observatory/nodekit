mod error;
mod md;
mod surface;

use blittle::stride::RGBA;
use blittle::{clip, PositionI, Size};
use bytemuck::cast_slice_mut;
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache};
pub use error::Error;
use md::{FontSize, parse};
use nodekit_rs_models::{JustificationHorizontal, JustificationVertical, Rect};
use nodekit_rs_visual::{BOARD_D_F64, ResizedRect, RgbaBuffer, RgbaRects, bitmap_rgba, parse_color_rgba, spatial_coordinate, to_blittle_size, BOARD_SIZE, VisualBuffer};
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
    ) -> Result<Option<RgbaBuffer>, Error> {
        let mut position = PositionI {
            x: spatial_coordinate(rect.position.x),
            y: spatial_coordinate(rect.position.y),
        };
        let mut src_size = to_blittle_size(&rect.size);
        let mut blit_size = src_size.clone();
        let position_u = clip(&position, &BOARD_SIZE, &mut blit_size);
        // No blits.
        if blit_size.w == 0 || blit_size.h == 0 {
            return Ok(None);
        }

        // Create the background.
        let mut buffers = vec![RgbaBuffer::new_rgba(nodekit_rs_visual::Rect {
            position: position_u,
            size: src_size
        },  parse_color_rgba(&text.background_color).map_err(Error::Visual)?)];

        let mut text_surface = RgbaBuffer::new_rgba(nodekit_rs_visual::Rect {
            position: position_u,
            size: src_size
        },  [0, 0, 0, 0]);

        // Get the font sizes.
        let font_size = FontSize::new((text.font_size * BOARD_D_F64).ceil() as u16);
        let mut buffer = Buffer::new(&mut self.font_system, Metrics::from(&font_size));
        let font_usize = font_size.font_size as usize;
        let font_isize = font_size.font_size as isize;
        let line_height = font_size.line_height as usize;

        // Apply padding.
        src_size.w -= font_usize * 2;
        src_size.h -= font_usize * 2;
        position.x += font_isize;
        position.y += font_isize;

        buffer.set_size(
            &mut self.font_system,
            Some(src_size.w as f32),
            Some(src_size.h as f32),
        );

        let text_color = parse_color_rgba(&text.text_color).map_err(Error::Visual)?;
        let text_color = Color::rgba(text_color[0], text_color[1], text_color[2], text_color[3]);
        let mut attrs = Attrs::new().color(text_color);
        attrs.family = Family::SansSerif;
        let paragraphs = parse(&text.text, &font_size, attrs.clone())?;
        let mut y = 0;
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

            // Draw.
            self.draw(text_color, src_size, y, &mut buffer, dst);
            // Update y
            y += height + line_height;
        }

        // The total height of the text.
        let height = y - line_height;
        let y_offset = match text.justification_vertical {
            JustificationVertical::Top => 0,
            JustificationVertical::Center => src_size.h.cast_signed() / 2 - height / 2,
            JustificationVertical::Bottom => src_size.h.cast_signed() - height,
        } + line_height;

        let offset = PositionI {
            x: spatial_coordinate(rect.position.x),
            y: spatial_coordinate(rect.position.y),
        };
        // Blit onto the final surface.
        Ok(surfaces
            .into_iter()
            .filter_map(|surface| {
                let position = PositionI {
                    x: offset.x + font_isize,
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

    fn draw(
        &mut self,
        text_color: Color,
        size: Size,
        y_offset: usize,
        buffer: &mut Buffer,
        dst: &mut VisualBuffer,
    ) {
        buffer.draw(
            &mut self.font_system,
            &mut self.swash_cache,
            text_color,
            |x, y, w, h, color| {
                let x1 = (x as usize + w as usize).min(size.w);
                let y1 = (y as usize + h as usize + y_offset).min(size.h);
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

    fn add_padding(
        buffers: &mut Vec<RgbaBuffer>,
        position: PositionI,
        src_size: &Size,
        font_usize: usize,
        background_color: [u8; 4],
    ) {
        let padding_horizontal = bitmap_rgba(src_size.w, font_usize, background_color);
        let horizontal_size = Size {
            w: src_size.w,
            h: font_usize,
        };
        if let Some(top) = RgbaRects::new(&ResizedRect {
            position,
            size: horizontal_size,
        }) {
            buffers.push(RgbaBuffer {
                buffer: padding_horizontal.clone(),
                rects: top,
            })
        };
        if let Some(bottom) = RgbaRects::new(&ResizedRect {
            position: PositionI {
                x: position.x,
                y: position.y + (src_size.h - font_usize).cast_signed(),
            },
            size: horizontal_size,
        }) {
            buffers.push(RgbaBuffer {
                buffer: padding_horizontal.clone(),
                rects: bottom,
            })
        };

        let vertical_h = src_size.h - font_usize * 2;
        let padding_vertical = bitmap_rgba(font_usize, vertical_h, background_color);
        let vertical_size = Size {
            w: font_usize,
            h: vertical_h,
        };
        let vertical_y = position.y + vertical_h.cast_signed();
        if let Some(left) = RgbaRects::new(&ResizedRect {
            position: PositionI {
                x: position.x,
                y: vertical_y,
            },
            size: vertical_size,
        }) {
            buffers.push(RgbaBuffer {
                buffer: padding_vertical.clone(),
                rects: left,
            })
        };
        if let Some(right) = RgbaRects::new(&ResizedRect {
            position: PositionI {
                x: position.x + (src_size.w - font_usize).cast_signed(),
                y: vertical_y,
            },
            size: vertical_size,
        }) {
            buffers.push(RgbaBuffer {
                buffer: padding_horizontal.clone(),
                rects: right,
            })
        };
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
