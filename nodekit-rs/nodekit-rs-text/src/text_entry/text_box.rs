use super::{CORNER_ISIZE, CORNER_SIZE, corner};
use blittle::overlay::{Vec4, rgba8_to_rgba32};
use blittle::{PositionI, Size};
use bytemuck::{cast_slice, cast_slice_mut};
use lazy_static::lazy_static;
use nodekit_rs_models::board::{BOARD_SIZE, RgbColor};
use nodekit_rs_visual::{Board, BorrowedRgbaBuffer, RgbBuffer, UnclippedRect, bitmap_rgb};

lazy_static! {
    static ref NW: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/text_box_nw.raw"));
    static ref NE: Vec<Vec4> = rgba8_to_rgba32(include_bytes!("../../text_entry/text_box_ne.raw"));
    static ref LINE: Vec<RgbColor> =
        cast_slice::<u8, RgbColor>(include_bytes!("../../text_entry/text_box_line.raw")).to_vec();
}

const COLOR: RgbColor = [255; 3];

/// The background of a TextEntry card.
pub struct TextBox {
    /// Northwest corner.
    nw: Option<BorrowedRgbaBuffer<'static>>,
    /// Northeast corner.
    ne: Option<BorrowedRgbaBuffer<'static>>,
    header: Option<RgbBuffer>,
    body: Option<RgbBuffer>,
}

impl TextBox {
    pub fn new(position: PositionI, size: Size) -> Self {
        // Get the corners.
        let nw = corner(&NW, position.x, position.y);
        let ne = corner(
            &NE,
            position.x + size.w.cast_signed() - CORNER_ISIZE,
            position.y,
        );

        // Get the header.
        let mut header = if size.w == 0 {
            None
        } else {
            UnclippedRect {
                position: PositionI {
                    x: position.x + CORNER_ISIZE,
                    y: position.y,
                },
                size: Size {
                    w: size.w - CORNER_SIZE * 2,
                    h: CORNER_SIZE,
                },
            }
            .into_clipped_rect(BOARD_SIZE)
            .map(|rect| RgbBuffer::new(bitmap_rgb(rect.src_size.w, CORNER_SIZE, COLOR), rect))
        };
        // Draw a line on the header.
        if let Some(header) = header.as_mut() {
            Self::draw_header_line(header);
        }

        let mut body = if size.w == 0 {
            None
        } else {
            UnclippedRect {
                position: PositionI {
                    x: position.x,
                    y: position.y + CORNER_ISIZE,
                },
                size,
            }
            .into_clipped_rect(BOARD_SIZE)
            .map(|rect| RgbBuffer::new(bitmap_rgb(size.w, size.h, COLOR), rect))
        };
        if let Some(body) = body.as_mut() {
            Self::draw_body_lines(body);
        }

        Self {
            nw,
            ne,
            header,
            body,
        }
    }

    fn draw_header_line(header: &mut RgbBuffer) {
        let w = header.rect.src_size.w;
        let buffer = cast_slice_mut::<u8, [u8; 3]>(header.buffer_mut());
        LINE.iter()
            .zip(buffer.chunks_exact_mut(w))
            .for_each(|(pixel, row)| {
                row.fill(*pixel);
            });
    }

    fn draw_body_lines(body: &mut RgbBuffer) {
        let w = body.rect.src_size.w;
        let buffer = cast_slice_mut::<u8, [u8; 3]>(body.buffer_mut());
        buffer.chunks_exact_mut(w).for_each(|row| {
            LINE.iter().enumerate().for_each(|(i, pixel)| {
                let pixel = *pixel;
                row[i] = pixel;
                row[w - i - 1] = pixel;
            })
        });
    }

    pub fn blit(&self, board: &mut Board) {
        if let Some(nw) = self.nw.as_ref() {
            board.overlay_borrowed_rgba(nw);
        }
        if let Some(ne) = self.ne.as_ref() {
            board.overlay_borrowed_rgba(ne);
        }
        if let Some(header) = self.header.as_ref() {
            board.blit_rgb(header);
        }
        if let Some(body) = self.body.as_ref() {
            board.blit_rgb(body);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_models::board::{HORIZONTAL, VERTICAL};
    use nodekit_rs_png::board_to_png;
    use nodekit_rs_visual::Board;

    #[test]
    fn test_gutter() {
        let mut board = Board::new([50, 0, 0]);
        let header = TextBox::new(
            PositionI { x: 100, y: 100 },
            Size {
                w: HORIZONTAL.u_size / 2,
                h: VERTICAL.u_size / 3,
            },
        );
        header.blit(&mut board);
        board_to_png("header.png", board.get_board_without_cursor());
    }
}
