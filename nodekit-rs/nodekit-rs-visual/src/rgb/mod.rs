mod rect;

use crate::board::*;
use crate::{Error, resize};
use fast_image_resize::PixelType;
use nodekit_rs_models::Rect;
pub use rect::*;

/// A raw RGB24 bitmap and its pixel size.
pub struct RgbBuffer {
    /// A raw RGB24 bitmap.
    pub buffer: Vec<u8>,
    pub rect: RgbRect,
}

impl RgbBuffer {
    pub fn blit(&self, board: &mut [u8]) {
        blittle::blit(
            &self.buffer,
            &self.rect.size,
            board,
            &self.rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut [u8],
        src_width: u32,
        src_height: u32,
        dst: Rect,
    ) -> Result<Self, Error> {
        let (buffer, rect) = resize(buffer, src_width, src_height, dst, PixelType::U8x3)?;
        let rect = RgbRect::from(rect);
        Ok(Self { buffer, rect })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use blittle::PositionU;
    use nodekit_rs_models::{Position, Size};
    use png::ColorType;
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_rgb_buffer() {
        let buffer = get_rgb_buffer();
        encode(
            "rgb_test.png",
            &RgbBuffer {
                buffer,
                rect: RgbRect {
                    position: PositionU::default(),
                    size: blittle::Size { w: 300, h: 600 },
                },
            },
        );
    }

    #[test]
    fn test_rgb_buffer_blit() {
        let mut board = board([255, 0, 255]);

        let visual = RgbBuffer {
            buffer: get_rgb_buffer(),
            rect: RgbRect {
                position: PositionU::default(),
                size: blittle::Size { w: 300, h: 600 },
            },
        };
        visual.blit(&mut board);
        encode(
            "rgb_blit.png",
            &RgbBuffer {
                buffer: board,
                rect: RgbRect {
                    position: PositionU::default(),
                    size: blittle::Size {
                        w: BOARD_D,
                        h: BOARD_D,
                    },
                },
            },
        );
    }

    #[test]
    fn test_rgb_buffer_resize() {
        let resized = RgbBuffer::new_resized(
            &mut get_rgb_buffer(),
            300,
            600,
            Rect {
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
        encode("rgb_resize.png", &resized);
    }

    fn encode(filename: &str, visual: &RgbBuffer) {
        let file = File::create(filename).unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder =
            png::Encoder::new(w, visual.rect.size.w as u32, visual.rect.size.h as u32);
        encoder.set_color(ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(&visual.buffer).unwrap();
    }

    fn get_rgb_buffer() -> Vec<u8> {
        include_bytes!("../../test_files/rgb.raw").to_vec()
    }
}
