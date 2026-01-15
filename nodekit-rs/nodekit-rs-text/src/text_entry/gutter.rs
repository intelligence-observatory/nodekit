use super::{CORNER_ISIZE, CORNER_SIZE, GUTTER_HEIGHT, corner};
use blittle::overlay::{Vec4, rgba8_to_rgba32};
use blittle::{PositionI, Size};
use lazy_static::lazy_static;
use nodekit_rs_models::board::{BOARD_SIZE, RgbColor};
use nodekit_rs_visual::{Board, BorrowedRgbaBuffer, RgbBuffer, UnclippedRect, bitmap_rgb};

const COLOR: RgbColor = [220; 3];

lazy_static! {
    static ref SW: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/gutter_sw.raw"));
    static ref SE: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/gutter_se.raw"));
}

pub struct Gutter {
    /// Southwest corner.
    sw: Option<BorrowedRgbaBuffer<'static>>,
    /// Southeast corner.
    se: Option<BorrowedRgbaBuffer<'static>>,
    /// The body above the corners.
    body: Option<RgbBuffer>,
    /// The rectangle between the corners.
    footer: Option<RgbBuffer>,
}

impl Gutter {
    pub fn new(position: PositionI, width: usize) -> Self {
        // Get the corners.
        let corner_y = position.y + GUTTER_HEIGHT.cast_signed();
        let sw = corner(&SW, position.x, corner_y);
        let se = corner(
            &SE,
            position.x + width.cast_signed() - CORNER_ISIZE,
            corner_y,
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
            .map(|rect| RgbBuffer::new(bitmap_rgb(width, GUTTER_HEIGHT, COLOR), rect))
        };
        let footer = if width == 0 {
            None
        } else {
            UnclippedRect {
                position: PositionI {
                    x: position.x + CORNER_ISIZE,
                    y: position.y + GUTTER_HEIGHT.cast_signed(),
                },
                size: Size {
                    w: width - CORNER_SIZE * 2,
                    h: CORNER_SIZE,
                },
            }
            .into_clipped_rect(BOARD_SIZE)
            .map(|rect| RgbBuffer::new(bitmap_rgb(width, CORNER_SIZE, COLOR), rect))
        };
        Self {
            sw,
            se,
            body,
            footer,
        }
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
        if let Some(footer) = self.footer.as_ref() {
            board.blit_rgb(footer);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_models::board::*;
    use nodekit_rs_png::board_to_png;

    #[test]
    fn test_gutter() {
        let mut board = Board::new([50, 0, 0]);
        let gutter = Gutter::new(
            PositionI {
                x: 0,
                y: VERTICAL.i_size - 100,
            },
            VERTICAL.u_size / 2,
        );
        gutter.blit(&mut board);
        board_to_png("gutter.png", board.get_board_without_cursor());
    }
}
