mod error;
mod md;
mod text_buffers;
mod text_entry;

use blittle::{ClippedRect, PositionI, Size};
use cosmic_text::fontdb::Source;
use cosmic_text::{Align, Attrs, Buffer, Color, Family, FontSystem, Metrics, Shaping, SwashCache};
pub use error::Error;
use md::{FontSize, parse};
use nodekit_rs_models::board::*;
use nodekit_rs_models::{
    JustificationHorizontal, JustificationVertical, Region, TextCard, TextEntry,
};
use nodekit_rs_visual::{
    RgbBuffer, RgbaBuffer, UnclippedRect, VisualBuffer, bitmap_rgb, parse_color_rgba,
};
use pyo3::pyclass;
use std::sync::Arc;
pub use text_buffers::TextBuffers;
pub use text_entry::TextEntryBuffers;
use text_entry::*;

#[pyclass]
pub struct TextEngine {
    font_system: FontSystem,
    swash_cache: SwashCache,
}

impl TextEngine {
    pub fn render_text_card(
        &mut self,
        text_card: &TextCard,
        region: &Region,
    ) -> Result<Option<TextBuffers>, Error> {
        // Get the rect.
        match UnclippedRect::new(region).into_clipped_rect(BOARD_SIZE) {
            None => Ok(None),
            Some(background_rect) => {
                // Get the background buffer.
                let background = Self::get_background(background_rect, text_card)?;
                // Get the font sizes.
                let font_size = FontSize::new(text_card.font_size.cast_unsigned() as u16);

                // Get the size of the text buffer.
                // Apply padding.
                let mut text_size = background_rect.src_size;
                text_size.w -= font_size.font_usize * 2;
                text_size.h -= font_size.font_usize * 2;

                let mut text_buffers = TextBuffers {
                    background,
                    foreground: None,
                };

                // Get the text rect. Draw text.
                if let Some(rect) = ClippedRect::new(PositionI::default(), BOARD_SIZE, text_size) {
                    text_buffers.foreground =
                        self.get_text(text_card, font_size, rect, background_rect.src_size)?;
                }
                Ok(Some(text_buffers))
            }
        }
    }

    pub fn render_text_entry(
        &mut self,
        text_entry: &TextEntry,
        region: &Region,
    ) -> Result<Option<TextEntryBuffers>, Error> {
        match UnclippedRect::new(region).into_clipped_rect(BOARD_SIZE) {
            None => Ok(None),
            Some(background_rect) => {
                // Get the font sizes.
                let font_size = FontSize::new(text_entry.font_size as u16);

                // Render text.
                match text_rect(&background_rect) {
                    None => Ok(None),
                    Some(rect) => {
                        // Create a text card.
                        let (text, text_color) = if text_entry.text.is_empty() {
                            (text_entry.prompt.clone(), "#DCDCDCFF")
                        } else {
                            (text_entry.text.clone(), "#000000FF")
                        };
                        let text_card = TextCard {
                            text,
                            font_size: text_entry.font_size,
                            justification_vertical: JustificationVertical::Top,
                            justification_horizontal: JustificationHorizontal::Left,
                            text_color: text_color.to_string(),
                            background_color: "#00000000".to_string(),
                        };
                        // Render.
                        let text = self.get_text(&text_card, font_size, rect, BOARD_SIZE)?;
                        Ok(Some(TextEntryBuffers::new(text, background_rect)))
                    }
                }
            }
        }
    }

    fn get_background(
        rect: ClippedRect,
        text_card: &TextCard,
    ) -> Result<Option<VisualBuffer>, Error> {
        let background_color =
            parse_color_rgba(&text_card.background_color).map_err(Error::BackgroundColor)?;
        Ok(if background_color[3] == 0 {
            None
        } else if background_color[3] == 255 {
            Some(VisualBuffer::Rgb(RgbBuffer::new(
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
            )))
        } else {
            Some(VisualBuffer::Rgba(RgbaBuffer::new(rect, background_color)))
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
                let x = if x < 0 { 0 } else { x.cast_unsigned() };
                let y = if y < 0 { 0 } else { y.cast_unsigned() };
                let x1 = ((x + w) as usize).min(dst.rect.src_size_clipped.w);
                let y1 = ((y + h) as usize + y_offset).min(dst.rect.src_size_clipped.h);
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
    fn test_text_card_render() {
        let card = TextCard {
            text: include_str!("../lorem.txt").to_string(),
            font_size: 20,
            justification_horizontal: JustificationHorizontal::Left,
            justification_vertical: JustificationVertical::Center,
            text_color: "#000000FF".to_string(),
            background_color: "#AAAAAAFF".to_string(),
        };
        let region = Region::default();

        // Render the text.
        let mut text = TextEngine::default();
        let mut board = Board::new([200, 200, 200]);
        let text_buffer = text.render_text_card(&card, &region).unwrap().unwrap();
        text_buffer.blit(&mut board);
        // Write the result as a .png file.
        nodekit_rs_png::board_to_png("out.png", board.get_board_without_cursor());
    }

    #[test]
    fn test_text_entry_render() {
        let card = TextEntry {
            prompt: String::default(),
            text: include_str!("../lorem.txt").to_string(),
            font_size: 20,
        };
        let region = Region::default();

        // Render the text.
        let mut text = TextEngine::default();
        let mut board = Board::new([200, 200, 200]);
        let text_buffer = text.render_text_entry(&card, &region).unwrap().unwrap();
        text_buffer.blit(&mut board);
        // Write the result as a .png file.
        nodekit_rs_png::board_to_png("text_entry.png", board.get_board_without_cursor());

        let card = TextEntry {
            prompt: "This is a prompt".to_string(),
            text: String::default(),
            font_size: 20,
        };

        // Render the text.
        let mut board = Board::new([200, 200, 200]);
        let text_buffer = text.render_text_entry(&card, &region).unwrap().unwrap();
        text_buffer.blit(&mut board);
        // Write the result as a .png file.
        nodekit_rs_png::board_to_png("text_entry_prompt.png", board.get_board_without_cursor());
    }
}
