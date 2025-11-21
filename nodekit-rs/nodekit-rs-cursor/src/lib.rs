use blittle::{PositionI, Size, clip};
use nodekit_rs_models::Position;
use nodekit_rs_visual::*;

const CURSOR_SIZE: Size = Size { w: 34, h: 44 };

/// A cursor icon.
pub struct Cursor {
    cursor: Vec<u8>,
}

impl Cursor {
    /// Blit the cursor onto the `board` image.
    pub fn blit(&mut self, position: &Position, board: &mut [u8]) {
        // Convert to pixel coordinates.
        let position = PositionI {
            x: spatial_coordinate(position.x),
            y: spatial_coordinate(position.y),
        };
        let mut src_size = CURSOR_SIZE;
        // Clip.
        let position = clip(&position, &BOARD_SIZE, &mut src_size);
        overlay(&self.cursor, &src_size, board, &position, &BOARD_SIZE);
    }
}

impl Default for Cursor {
    fn default() -> Self {
        Self {
            cursor: include_bytes!("../cursor").to_vec(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs::File, io::BufWriter};

    #[test]
    fn test_cursor_size() {
        let cursor = Cursor::default();
        assert_eq!(cursor.cursor.len(), CURSOR_SIZE.w * CURSOR_SIZE.h * 4);
    }

    #[test]
    fn blit_cursor_image() {
        let mut visual = board([50, 100, 50]);
        let mut cursor = Cursor::default();
        cursor.blit(
            &Position {
                x: -0.519,
                y: -0.499,
            },
            &mut visual,
        );

        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);

        let mut encoder = png::Encoder::new(w, BOARD_D as u32, BOARD_D as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();

        writer.write_image_data(&visual).unwrap();
    }
}
