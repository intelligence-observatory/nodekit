use crate::rect::Rect;
use crate::{Error, resize};
use fast_image_resize::PixelType;

/// A raw RGB24 bitmap and its pixel size.
pub struct RgbBuffer {
    /// A raw RGB24 bitmap.
    pub(crate) buffer: Vec<u8>,
    pub rect: Rect,
}

impl RgbBuffer {
    pub fn new(buffer: Vec<u8>, rect: Rect) -> Self {
        Self { buffer, rect }
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut [u8],
        src_width: u32,
        src_height: u32,
        dst: nodekit_rs_models::Rect,
    ) -> Result<Self, Error> {
        let (buffer, rect) = resize(buffer, src_width, src_height, &dst, PixelType::U8x3)?;
        let rect = Rect::from(rect);
        Ok(Self { buffer, rect })
    }

    pub fn buffer_ref(&self) -> &[u8] {
        &self.buffer
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::board::*;
    use blittle::PositionU;
    use nodekit_rs_models::{Position, Size};

    #[test]
    fn test_rgb_buffer() {
        let buffer = get_rgb_buffer();
        nodekit_rs_png::rgb_to_png(
            "test_rgb.png",
            buffer.buffer_ref(),
            buffer.rect.size.w as u32,
            buffer.rect.size.h as u32,
        );
    }

    #[test]
    fn test_rgb_buffer_blit() {
        let mut board = Board::new([255, 0, 255]);
        board.blit_rgb(&get_rgb_buffer());
        nodekit_rs_png::board_to_png("rgb_blit.png", board.get_board_without_cursor());
    }

    #[test]
    fn test_rgb_buffer_resize() {
        let mut buffer = include_bytes!("../test_files/rgb.raw").to_vec();
        let resized = RgbBuffer::new_resized(
            &mut buffer,
            300,
            600,
            nodekit_rs_models::Rect {
                position: Position { x: -0.5, y: -0.5 },
                size: Size { w: 1., h: 1. },
            },
        )
        .unwrap();
        assert_eq!(resized.rect.position.x, 192);
        assert_eq!(resized.rect.position.y, 0);
        assert_eq!(resized.rect.size.w, BOARD_D / 2);
        assert_eq!(resized.rect.size.h, BOARD_D);
        assert_eq!(resized.buffer.len(), (BOARD_D / 2) * BOARD_D * 3);
        nodekit_rs_png::rgb_to_png(
            "rgb_resize.png",
            &resized.buffer,
            resized.rect.size.w as u32,
            resized.rect.size.h as u32,
        );
    }

    fn get_rgb_buffer() -> RgbBuffer {
        RgbBuffer {
            buffer: include_bytes!("../test_files/rgb.raw").to_vec(),
            rect: Rect {
                position: PositionU::default(),
                size: blittle::Size { w: 300, h: 600 },
            },
        }
    }
}
