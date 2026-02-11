use std::ops::SubAssign;
use crate::Error;
use blittle::{ClippedRect, PositionI};
use blittle::overlay::{rgba8_to_rgba32, Vec4};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{Board, RgbaBuffer, UnclippedRect};
use crate::gutter::{Gutter, GutterState};

const BORDER_COLOR_LEFT_0: Vec4 = Vec4::new(92.5, 92.5, 92.5, 1.);
const BORDER_COLOR_LEFT_1: Vec4 = Vec4::new(96.9, 96.9, 96.9, 1.);
const BORDER_COLOR_RIGHT: Vec4 = Vec4::new(99.2, 99.2, 99.2, 1.);

/// A text box with arbitrary text.
pub struct TextEntry {
    background: RgbaBuffer,
    /// The text buffer.
    /// This is initially None, and gets set by TextEngine.
    pub(crate) foreground: Option<RgbaBuffer>,
    /// Render the gutter.
    gutter: Option<Gutter>
}

impl TextEntry {
    pub fn new(region: &Region, gutter_confirm_button_text: &[Vec4]) -> Result<Option<Self>, Error> {
        const CORNER_D: usize = 8;
        const CORNERS_W: usize = 17;
        
        const fn resize_rect(rect: &mut UnclippedRect) -> Result<(), Error> {
            if rect.size.w >= CORNERS_W && rect.size.h >= CORNERS_W {
                // Resize the rect to make room for the gutter.
                rect.size.h -= CORNER_D + 1;
                Ok(())
            }
            else {
                Err(Error::TextEntrySize(rect.size))
            }
        }
        
        let mut rect = UnclippedRect::new(region);
        resize_rect(&mut rect)?;

        match rect.into_clipped_rect(BOARD_SIZE) {
            Some(rect) => {
                let corners = rgba8_to_rgba32(include_bytes!("../backgrounds/text_entry.raw"));

                // Get a white background.
                let mut background = vec![Vec4::ONE; rect.src_size.w * rect.src_size.h];
                let x1_offset = rect.src_size.w - CORNER_D;

                // Apply top border.
                for y in 0..=1 {
                    let color = corners[CORNER_D + y * CORNERS_W];
                    background[0..rect.src_size.w].fill(color);
                }

                // Apply corners to the top-left and top-right.
                for y in 0..CORNER_D {
                    for x in 0..CORNER_D {
                        let by1 = y * rect.src_size.w;
                        let cy1 = y * CORNERS_W;
                        background[x + by1] = corners[x + cy1];
                        background[x + x1_offset + by1] = corners[x + CORNER_D + cy1];
                    }
                }

                // Apply side borders.
                for y in CORNER_D..rect.src_size.h {
                    let by1 = y * rect.src_size.w;
                    background[by1] = BORDER_COLOR_LEFT_0;
                    background[1 + by1] = BORDER_COLOR_LEFT_1;
                    background[rect.src_size.w - 1 + by1] = BORDER_COLOR_RIGHT;
                }

                let background = RgbaBuffer {
                    buffer: background,
                    rect
                };

                let gutter_position = PositionI {
                    x: rect.dst_position.x,
                    y: rect.dst_position.y + rect.src_size.h.cast_signed() + 1
                };
                let gutter = Gutter::new(gutter_position, rect.src_size.w, &gutter_confirm_button_text);

                Ok(Some(Self {
                    background,
                    foreground: None,
                    gutter
                }))
            }
            None => Ok(None),
        }
    }

    pub const fn set_gutter_state(&mut self, gutter_state: GutterState) {
        if let Some(gutter) = self.gutter.as_mut() {
            gutter.set_state(gutter_state);
        }
    }

    pub fn blit(&self, board: &mut Board) {
        board.overlay_rgba(&self.background);
        if let Some(text) = self.foreground.as_ref() {
            board.overlay_rgba(text);
        }
        if let Some(gutter) = self.gutter.as_ref() {
            gutter.blit(board);
        }
    }

    pub fn get_clones_of_overlays(&self) -> Vec<RgbaBuffer> {
        let mut buffers = vec![self.background.clone()];
        if let Some(text) = self.foreground.clone() {
            buffers.push(text);
        }
        buffers
    }

    pub const fn rect(&self) -> ClippedRect {
        let mut rect = self.background.rect;
        if let Some(gutter) = self.gutter.as_ref() {
            rect.src_size.h += gutter.rect.src_size.h + 1;
        }
        rect
    }
}
