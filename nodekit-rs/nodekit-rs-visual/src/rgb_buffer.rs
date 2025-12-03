use crate::rect::Rect;
use crate::{Error, resize};
use fast_image_resize::PixelType;

/// A raw RGB24 bitmap and its pixel size.
pub struct RgbBuffer {
    /// A raw RGB24 bitmap.
    pub(crate) buffer: Vec<u8>,
    pub(crate) rect: Rect,
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
                rect: Rect {
                    position: PositionU::default(),
                    size: blittle::Size { w: 300, h: 600 },
                },
            },
        );
    }

    #[test]
    fn test_rgb_buffer_blit() {
        let mut board = Board::new([255, 0, 255]);

        let visual = RgbBuffer {
            buffer: get_rgb_buffer(),
            rect: Rect {
                position: PositionU::default(),
                size: blittle::Size { w: 300, h: 600 },
            },
        };
        board.blit_rgb(&visual);
        encode(
            "rgb_blit.png",
            &RgbBuffer {
                buffer: board.get_board_without_cursor().to_vec(),
                rect: Rect {
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
        include_bytes!("../test_files/rgb.raw").to_vec()
    }
}
