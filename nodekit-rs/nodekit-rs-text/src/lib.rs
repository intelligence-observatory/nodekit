mod error;
mod md;

use blittle::overlay::{overlay_rgba32, rgb8_to_rgba32, rgba32_to_rgb8_in_place};
use blittle::{ClippedRect, PositionI, Size};
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache};
pub use error::Error;
use md::{FontSize, parse};
use nodekit_rs_card::{JustificationHorizontal, JustificationVertical, Region, TextCard};
use nodekit_rs_visual::{
    BOARD_D_F64, BOARD_SIZE, RgbBuffer, RgbaBuffer, UnclippedRect, VisualBuffer, bitmap_rgb,
    parse_color_rgba,
};
use pyo3::pyclass;
use std::sync::Arc;

#[pyclass]
pub struct TextEngine {
    font_system: FontSystem,
    swash_cache: SwashCache,
}

impl TextEngine {
    pub fn render(
        &mut self,
        text_card: &TextCard,
        region: &Region,
    ) -> Result<Option<VisualBuffer>, Error> {
        // Get the rect.
        match UnclippedRect::new(region).into_clipped_rect(BOARD_SIZE) {
            None => Ok(None),
            Some(background_rect) => {
                // Get the background buffer.
                let mut background = Self::get_background(background_rect, text_card)?;
                // Get the font sizes.
                let font_size = FontSize::new((text_card.font_size * BOARD_D_F64).ceil() as u16);

                // Get the size of the text buffer.
                // Apply padding.
                let mut text_size = background_rect.src_size;
                text_size.w -= font_size.font_usize * 2;
                text_size.h -= font_size.font_usize * 2;

                // Get the text rect. Draw text.
                if let Some(rect) = ClippedRect::new(PositionI::default(), BOARD_SIZE, text_size)
                    && let Some(text_surface) =
                        self.get_text(text_card, font_size, rect, background_rect.src_size)?
                {
                    // Blit text.
                    Self::blit_text(text_surface, &mut background);
                }
                Ok(Some(background))
            }
        }
    }

    fn get_background(rect: ClippedRect, text_card: &TextCard) -> Result<VisualBuffer, Error> {
        let background_color =
            parse_color_rgba(&text_card.background_color).map_err(Error::BackgroundColor)?;
        Ok(if background_color[3] == 255 {
            VisualBuffer::Rgb(RgbBuffer::new(
                bitmap_rgb(
                    rect.src_size.w,
                    rect.src_size.h,
                    [
                        background_color[0],
                        background_color[1],
                        background_color[2],
                    ],
                ),
                rect,
            ))
        } else {
            VisualBuffer::Rgba(RgbaBuffer::new(rect, background_color))
        })
    }

    fn get_text(
        &mut self,
        text_card: &TextCard,
        font_size: FontSize,
        rect: ClippedRect,
        background_size: Size,
    ) -> Result<Option<RgbaBuffer>, Error> {
        let mut text_buffer = Buffer::new(&mut self.font_system, Metrics::from(&font_size));
        text_buffer.set_size(
            &mut self.font_system,
            Some(rect.src_size.w as f32),
            Some(rect.src_size.h as f32),
        );
        // Get the text color.
        let text_color = parse_color_rgba(&text_card.text_color).map_err(Error::TextColor)?;
        let text_color = Color::rgba(text_color[0], text_color[1], text_color[2], text_color[3]);
        // Prepare font attributes.
        let mut attrs = Attrs::new().color(text_color);
        attrs.family = Family::SansSerif;
        let mut text_surface = RgbaBuffer::new(rect, [0, 0, 0, 0]);
        // Parse the markdown text.
        let paragraphs = parse(&text_card.text, &font_size, attrs.clone())?;

        // Shape the glyphs.
        let mut y = 0;
        for paragraph in paragraphs {
            // Set the metrics of this paragraph.
            text_buffer.set_metrics(&mut self.font_system, paragraph.metrics);

            // Shape the text.
            text_buffer.set_rich_text(
                &mut self.font_system,
                paragraph
                    .spans
                    .iter()
                    .map(|span| (span.text.as_str(), span.attrs.clone())),
                &attrs,
                Shaping::Advanced,
                Some(Self::get_align(text_card.justification_horizontal)),
            );
            text_buffer.shape_until_scroll(&mut self.font_system, true);

            // Get the total rendered height.
            let height = (text_buffer
                .layout_runs()
                .map(|layout| layout.line_height)
                .sum::<f32>()
                * 1.2) as usize;

            // Draw.
            self.draw(text_color, y, &mut text_buffer, &mut text_surface);
            // Update y
            y += height + font_size.line_height_usize;
        }

        // The total height of the text.
        let height = (y - font_size.line_height_usize).cast_signed();

        // Get the vertical justification.
        let y_offset = match text_card.justification_vertical {
            JustificationVertical::Top => 0,
            JustificationVertical::Center => rect.src_size.h.cast_signed() / 2 - height / 2,
            JustificationVertical::Bottom => rect.src_size.h.cast_signed() - height,
        } + font_size.line_height_usize.cast_signed();

        // Unclip.
        let unclipped_rect = UnclippedRect {
            position: PositionI {
                x: rect.dst_position.x + font_size.font_isize,
                y: rect.dst_position.y + font_size.font_isize + y_offset,
            },
            size: rect.src_size,
        };

        Ok(unclipped_rect
            .into_clipped_rect(background_size)
            .map(|rect| {
                text_surface.rect = rect;
                text_surface
            }))
    }

    fn draw(
        &mut self,
        text_color: Color,
        y_offset: usize,
        buffer: &mut Buffer,
        dst: &mut RgbaBuffer,
    ) {
        buffer.draw(
            &mut self.font_system,
            &mut self.swash_cache,
            text_color,
            |x, y, w, h, color| {
                let x1 = (x as usize + w as usize).min(dst.rect.src_size_clipped.w);
                let y1 = (y as usize + h as usize + y_offset).min(dst.rect.src_size_clipped.h);
                let alpha = color.a();
                if alpha > 0 {
                    (x as usize..x1)
                        .zip(y as usize + y_offset..y1)
                        .for_each(|(x, y)| {
                            let index = x + y * dst.rect.src_size.w;
                            dst.overlay_pixel_rgba(&color.as_rgba(), index);
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

    fn blit_text(text: RgbaBuffer, background: &mut VisualBuffer) {
        match background {
            VisualBuffer::Rgb(background) => {
                let mut rgba32 = rgb8_to_rgba32(background.buffer_ref());
                overlay_rgba32(&text.buffer, &mut rgba32, &text.rect);
                rgba32_to_rgb8_in_place(&rgba32, background.buffer_mut())
            }
            VisualBuffer::Rgba(background) => {
                overlay_rgba32(&text.buffer, &mut background.buffer, &text.rect);
            }
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
    use nodekit_rs_visual::Board;

    #[test]
    fn test_text_render() {
        let card = TextCard {
            text: include_str!("../lorem.txt").to_string(),
            font_size: 0.02,
            justification_horizontal: JustificationHorizontal::Left,
            justification_vertical: JustificationVertical::Center,
            text_color: "#000000FF".to_string(),
            background_color: "#AAAAAAFF".to_string(),
        };
        let region = Region::default();

        // Render the text.
        let mut text = TextEngine::default();
        let mut board = Board::new([200, 200, 200]);
        let text_buffer = text.render(&card, &region).unwrap().unwrap();
        board.blit(&text_buffer);
        // Write the result as a .png file.
        nodekit_rs_png::board_to_png("out.png", board.get_board_without_cursor());
    }
}
