use blittle::{clip, PositionI, Size};
use nodekit_rs_models::Position;
use nodekit_rs_visual::*;

const CURSOR_SIZE: Size = Size { w: 34, h: 44 };

/// A cursor icon.
pub struct Cursor(RgbaBuffer);

impl Cursor {
    /// Blit the cursor onto the `board` image.
    pub fn blit(&mut self, position: &Position, board: &mut Board) {
        // Convert to pixel coordinates.
        let rect = ResizedRect {
            position: PositionI {
                x: spatial_coordinate(position.x),
                y: spatial_coordinate(position.y),
            },
            size: CURSOR_SIZE,
        };
        
        let position = PositionI {
            x: spatial_coordinate(position.x),
            y: spatial_coordinate(position.y),
        };
        let mut size = CURSOR_SIZE;
        let position = clip(&position, &BOARD_SIZE, &mut size);
        

        
        // Convert to an RGBA area.
        if let Some(rects) = RgbaRects::new(&rect) {
            // Set the rects.
            self.0.rects = rects;
            // Blit to the board.
            self.0.blit(board);
        }
    }
}

impl Default for Cursor {
    fn default() -> Self {
        let buffer = RgbaBuffer {
            buffer: include_bytes!("../cursor").to_vec(),
            rects: Default::default(),
        };
        Self(buffer)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs::File, io::BufWriter};

    #[test]
    fn test_cursor_size() {
        let cursor = Cursor::default();
        assert_eq!(cursor.0.buffer.len(), CURSOR_SIZE.w * CURSOR_SIZE.h * 4);
    }

    #[test]
    fn blit_cursor_image() {
        let mut visual = board([50, 100, 50]);
        let mut cursor = Cursor::default();
        cursor.blit(&Position { x: 0., y: 0. }, &mut visual);

        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);

        let mut encoder = png::Encoder::new(w, BOARD_D as u32, BOARD_D as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();

        writer.write_image_data(&visual).unwrap();
    }
}
