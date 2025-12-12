use crate::{BOARD_SIZE, Error, resize};
use blittle::{ClippedRect, Size};
use fast_image_resize::PixelType;
use nodekit_rs_card::Region;

/// A raw RGB24 bitmap and its pixel size.
pub struct RgbBuffer {
    /// A raw RGB24 bitmap.
    pub(crate) buffer: Vec<u8>,
    pub rect: ClippedRect,
}

impl RgbBuffer {
    pub fn new(buffer: Vec<u8>, rect: ClippedRect) -> Self {
        Self { buffer, rect }
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut [u8],
        bitmap_size: Size,
        region: &Region,
    ) -> Result<Option<Self>, Error> {
        let (buffer, rect) = resize(buffer, bitmap_size, &region, PixelType::U8x3)?;
        Ok(
            ClippedRect::new(rect.position, BOARD_SIZE, rect.size)
                .map(|rect| Self { buffer, rect }),
        )
    }

    pub fn buffer_ref(&self) -> &[u8] {
        &self.buffer
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::board::*;
    use blittle::PositionI;

    #[test]
    fn test_rgb_buffer() {
        let buffer = get_rgb_buffer();
        nodekit_rs_png::rgb_to_png(
            "test_rgb.png",
            buffer.buffer_ref(),
            buffer.rect.src_size.w as u32,
            buffer.rect.src_size.h as u32,
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
            Size {
                w: 300,
                h: 600,
            },
            &Region {
                x: -0.5,
                y: -0.5,
                w: 1.,
                h: 1.,
                z_index: None,
            },
        )
        .unwrap()
        .unwrap();
        assert_eq!(resized.rect.dst_position_clipped.x, 192);
        assert_eq!(resized.rect.dst_position_clipped.y, 0);
        assert_eq!(resized.rect.src_size_clipped.w, BOARD_D / 2);
        assert_eq!(resized.rect.src_size_clipped.h, BOARD_D);
        assert_eq!(resized.buffer.len(), (BOARD_D / 2) * BOARD_D * 3);
        nodekit_rs_png::rgb_to_png(
            "rgb_resize.png",
            &resized.buffer,
            resized.rect.src_size_clipped.w as u32,
            resized.rect.src_size_clipped.h as u32,
        );
    }

    fn get_rgb_buffer() -> RgbBuffer {
        RgbBuffer {
            buffer: include_bytes!("../test_files/rgb.raw").to_vec(),
            rect: ClippedRect::new(
                PositionI::default(),
                BOARD_SIZE,
                Size { w: 300, h: 600 },
            )
            .unwrap(),
        }
    }
}
