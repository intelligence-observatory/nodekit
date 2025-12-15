//! Various constants used to describe the size of the visual board.

use crate::VisualBuffer;
use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;
use blittle::overlay::*;
use blittle::*;
use bytemuck::cast_slice_mut;

pub const BOARD_D: usize = 768;
pub const BOARD_D_U32: u32 = 768;
pub const BOARD_D_ISIZE: isize = 768;
pub const BOARD_D_F64: f64 = 768.;
pub const BOARD_D_F64_HALF: f64 = 384.;
pub const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};
pub const STRIDE: usize = stride::RGB;

/// Convert a value between -0.5 and 0.5 into a pixel coordinate.
pub const fn spatial_coordinate(c: f64) -> isize {
    (BOARD_D_F64_HALF + BOARD_D_F64 * c) as isize
}

/// Convert a value between 0 and 1 into a pixel coordinate.
pub const fn size_coordinate(c: f64) -> usize {
    (BOARD_D_F64 * c) as usize
}

/// Create a bitmap and fill it with a color.
pub fn bitmap_rgb(width: usize, height: usize, color: [u8; STRIDE]) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * STRIDE];
    cast_slice_mut::<u8, [u8; STRIDE]>(&mut bitmap).fill(color);
    bitmap
}

pub struct Board {
    board8_without_cursor: Vec<u8>,
    board8_final: Vec<u8>,
    /// An empty board used to clear the bitmap.
    board8_clear: Vec<u8>,
    board32: Vec<Vec4>,
    board32_zeros: Vec<Vec4>,
    dirty: bool,
    color: [u8; STRIDE],
}

impl Board {
    pub fn new(color: [u8; STRIDE]) -> Self {
        // Create the boards.
        let board8 = bitmap_rgb(BOARD_D, BOARD_D, color);
        let board32 = rgb8_to_rgba32(&board8);
        let board32_zeros = vec![Vec4::default(); board32.len()];
        Self {
            board8_without_cursor: board8.clone(),
            board8_clear: board8.clone(),
            board8_final: board8,
            board32,
            board32_zeros,
            dirty: false,
            color,
        }
    }

    pub fn fill(&mut self, color: [u8; STRIDE]) {
        self.color = color;
        fill(&mut self.board8_clear, color);
        self.clear();
    }

    pub fn clear(&mut self) {
        self.board8_without_cursor
            .copy_from_slice(&self.board8_clear);
    }

    pub fn blit(&mut self, buffer: &VisualBuffer) {
        match buffer {
            VisualBuffer::Rgb(buffer) => self.blit_rgb(buffer),
            VisualBuffer::Rgba(buffer) => self.overlay_rgba(buffer),
        }
    }

    /// Blit RGB8 onto the board.
    pub fn blit_rgb(&mut self, buffer: &RgbBuffer) {
        // Apply the overlays.
        self.apply_overlays();
        // Then blit on top of them.
        blit(
            &buffer.buffer,
            &mut self.board8_without_cursor,
            &buffer.rect,
            STRIDE,
        );
    }

    pub fn overlay_rgba(&mut self, buffer: &RgbaBuffer) {
        // Mark as dirty.
        if !self.dirty {
            self.dirty = true;
            // Convert RGB8 data into RGBA32 data.
            rgb8_to_rgba32_in_place(&self.board8_without_cursor, &mut self.board32);
        }
        // Overlay.
        overlay_rgba32(&buffer.buffer, &mut self.board32, &buffer.rect);
    }

    pub fn blit_cursor(&mut self, buffer: &[Vec4], rect: &Option<ClippedRect>) -> &[u8] {
        // Apply remaining overlays.
        self.apply_overlays();
        // Convert RGB8 data into RGBA32 data.
        rgb8_to_rgba32_in_place(&self.board8_without_cursor, &mut self.board32);

        // Overlay cursor.
        if let Some(rect) = rect {
            overlay_rgba32(buffer, &mut self.board32, rect);
        }

        // Copy to the final board.
        self.board8_final
            .copy_from_slice(&self.board8_without_cursor);
        // Apply the overlaid cursor.
        rgba32_to_rgb8_in_place(&self.board32, &mut self.board8_final);
        // Clear overlays.
        self.board32.copy_from_slice(&self.board32_zeros);
        // Clean.
        self.dirty = false;
        &self.board8_final
    }

    pub fn get_board_without_cursor(&mut self) -> &[u8] {
        // Apply remaining overlays.
        self.apply_overlays();
        &self.board8_without_cursor
    }

    fn apply_overlays(&mut self) {
        if self.dirty {
            // Apply overlays.
            rgba32_to_rgb8_in_place(&self.board32, &mut self.board8_without_cursor);
            // Clear overlays.
            self.board32.copy_from_slice(&self.board32_zeros);
            // Clean.
            self.dirty = false;
        }
    }

    pub fn erase(&mut self, rect: &ClippedRect) {
        let src_w = rect.src_size_clipped.w * STRIDE;
        let src = &self.board8_clear[0..src_w];
        (0..rect.src_size_clipped.h).for_each(|src_y| {
            let dst_index = get_index(
                rect.dst_position_clipped.x,
                rect.dst_position_clipped.y + src_y,
                rect.dst_size.w,
                STRIDE,
            );
            self.board8_without_cursor[dst_index..dst_index + src_w].copy_from_slice(src);
        });
    }
}

impl Default for Board {
    fn default() -> Self {
        Self::new([0, 0, 0])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::Cursor;

    #[test]
    fn test_board_constants() {
        assert_eq!(BOARD_D, BOARD_D_U32 as usize);
        assert_eq!(BOARD_D, BOARD_D_ISIZE as usize);
        assert_eq!(BOARD_D, BOARD_D_F64 as usize);
        assert_eq!(BOARD_D / 2, BOARD_D_F64_HALF as usize);
    }

    #[test]
    fn test_coordinates() {
        assert_eq!(spatial_coordinate(0.), BOARD_D_ISIZE / 2);
        assert_eq!(spatial_coordinate(-0.5), 0);
        assert_eq!(spatial_coordinate(0.5), BOARD_D_ISIZE);

        assert_eq!(size_coordinate(0.), 0);
        assert_eq!(size_coordinate(1.), BOARD_D);
    }

    #[test]
    fn test_blit_cursor() {
        let mut board = Board::new([200, 200, 200]);
        let cursor = Cursor::default();
        nodekit_rs_png::board_to_png(
            "cursor.png",
            &board.blit_cursor(&cursor.0, &Cursor::rect(0., 0.)),
        );
    }
}
