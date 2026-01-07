mod gutter;
mod text_box;

use crate::text_entry::text_box::TextBox;
use blittle::overlay::Vec4;
use blittle::{ClippedRect, PositionI, Size};
pub use gutter::Gutter;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{Board, BorrowedRgbaBuffer, RgbaBuffer, UnclippedRect};

const CORNER_SIZE: usize = 16;
const CORNER_ISIZE: isize = CORNER_SIZE.cast_signed();
/// The height of the gutter, minus `CORNER_SIZE`.
const GUTTER_HEIGHT: usize = 44;

pub struct TextEntryBuffers {
    pub text_box: TextBox,
    pub text: Option<RgbaBuffer>,
    pub gutter: Gutter,
    pub rect: ClippedRect,
}

impl TextEntryBuffers {
    pub fn new(text: Option<RgbaBuffer>, rect: ClippedRect) -> Self {
        let text_box_h = rect.src_size.h - GUTTER_HEIGHT;
        let text_box = TextBox::new(
            rect.dst_position,
            Size {
                w: rect.src_size.w,
                h: text_box_h,
            },
        );

        let gutter = Gutter::new(
            PositionI {
                x: rect.dst_position.x,
                y: rect.dst_position.y + text_box_h.cast_signed(),
            },
            rect.src_size.w,
        );
        Self {
            text_box,
            text,
            gutter,
            rect,
        }
    }

    pub fn blit(&self, board: &mut Board) {
        self.text_box.blit(board);
        self.gutter.blit(board);
        if let Some(text) = self.text.as_ref() {
            board.overlay_rgba(text);
        }
    }
}

fn corner(buffer: &[Vec4], x: isize, y: isize) -> Option<BorrowedRgbaBuffer<'_>> {
    UnclippedRect {
        position: PositionI { x, y },
        size: Size {
            w: CORNER_SIZE,
            h: CORNER_SIZE,
        },
    }
    .into_clipped_rect(BOARD_SIZE)
    .map(|rect| BorrowedRgbaBuffer { buffer, rect })
}

pub const fn text_rect(background_rect: &ClippedRect) -> Option<ClippedRect> {
    UnclippedRect {
        position: PositionI {
            x: background_rect.dst_position.x + CORNER_ISIZE,
            y: background_rect.dst_position.y,
        },
        size: Size {
            w: background_rect.src_size.w - CORNER_SIZE * 3,
            h: background_rect.src_size.h - CORNER_SIZE * 3 - GUTTER_HEIGHT,
        },
    }
    .into_clipped_rect(BOARD_SIZE)
}
