use blittle::overlay::{Vec4, rgba8_to_rgba32};
use blittle::{PositionI, Size};
use lazy_static::lazy_static;
use nodekit_rs_visual::{
    BOARD_SIZE, Board, BorrowedRgbaBuffer, RgbBuffer, UnclippedRect, bitmap_rgb,
};

const CORNER_SIZE: usize = 16;
/// The height of the gutter, minus `CORNER_SIZE`.
const GUTTER_HEIGHT: usize = 44;

lazy_static! {
    static ref SW: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/gutter_sw.raw"));
    static ref SE: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/gutter_se.raw"));
}

macro_rules! corner {
    ($buffer:expr, $x:expr, $y:ident) => {{
        UnclippedRect {
            position: PositionI { x: $x, y: $y },
            size: Size {
                w: CORNER_SIZE,
                h: CORNER_SIZE,
            },
        }
        .into_clipped_rect(BOARD_SIZE)
        .map(|rect| BorrowedRgbaBuffer {
            buffer: $buffer,
            rect,
        })
    }};
}

pub struct Gutter<'g> {
    pub sw: Option<BorrowedRgbaBuffer<'g>>,
    pub se: Option<BorrowedRgbaBuffer<'g>>,
    pub body: Option<RgbBuffer>,
}

impl Gutter<'_> {
    pub fn new(position: PositionI, width: usize) -> Self {
        let corner_size = CORNER_SIZE.cast_signed();
        // Get the corners.
        let corner_y = position.y + GUTTER_HEIGHT.cast_signed();
        let sw = corner!(&SW, position.x, corner_y);
        let se = corner!(
            &SE,
            position.x + corner_size + width.cast_signed(),
            corner_y
        );
        let body = if width == 0 {
            None
        } else {
            UnclippedRect {
                position,
                size: Size {
                    w: width,
                    h: GUTTER_HEIGHT,
                },
            }
            .into_clipped_rect(BOARD_SIZE)
            .map(|rect| RgbBuffer::new(bitmap_rgb(width, GUTTER_HEIGHT, [220, 220, 220]), rect))
        };
        Self { sw, se, body }
    }

    pub fn blit(&self, board: &mut Board) {
        if let Some(sw) = self.sw.as_ref() {
            board.overlay_borrowed_rgba(sw);
        }
        if let Some(se) = self.se.as_ref() {
            board.overlay_borrowed_rgba(se);
        }
        if let Some(body) = self.body.as_ref() {
            board.blit_rgb(body);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_png::board_to_png;
    use nodekit_rs_visual::{BOARD_D, BOARD_D_ISIZE, Board};

    #[test]
    fn test_gutter() {
        let mut board = Board::new([50, 0, 0]);
        let gutter = Gutter::new(
            PositionI {
                x: 0,
                y: BOARD_D_ISIZE - 100,
            },
            BOARD_D / 2,
        );
        gutter.blit(&mut board);
        board_to_png("gutter.png", board.get_board_without_cursor());
    }
}
