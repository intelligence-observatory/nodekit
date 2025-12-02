//! Various constants used to describe the size of the visual board.

use blittle::stride::RGBA;
use blittle::*;
use blittle::overlay::*;
use bytemuck::cast_slice_mut;
use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;

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

/// Create a bitmap and fill it with a color.
pub fn bitmap_rgba(width: usize, height: usize, color: [u8; RGBA]) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * RGBA];
    cast_slice_mut::<u8, [u8; RGBA]>(&mut bitmap).fill(color);
    bitmap
}

pub struct Board {
    board8_without_cursor: Vec<u8>,
    board8_final: Vec<u8>,
    board32: Vec<Vec4>,
    board32_zeros: Vec<Vec4>,
    dirty: bool,
}

impl Board {
    pub fn new(color: [u8; STRIDE]) -> Self {
        // Create the boards.
        let board8 = bitmap_rgb(BOARD_D, BOARD_D, color);
        let board32 = rgb8_to_rgba32(&board8);
        let board32_zeros = vec![Vec4::default(); board32.len()];
        Self {
            board8_without_cursor: board8.clone(),
            board8_final: board8,
            board32,
            board32_zeros,
            dirty: false
        }
    }

    /// Blit RGB8 onto the board.
    pub fn blit(&mut self, buffer: &RgbBuffer) {
        // Apply the overlays.
        self.apply_overlays();
        // Then blit on top of them.
        blit(&buffer.buffer, &buffer.rect.size, &mut self.board8_without_cursor, &buffer.rect.position, &BOARD_SIZE, STRIDE);
    }

    pub fn overlay(&mut self, buffer: &RgbaBuffer) {
        self.dirty = true;
        overlay_rgba32(&buffer.buffer, &buffer.rect.size, &mut self.board32, &buffer.rect.position, &BOARD_SIZE);
    }

    pub fn apply_overlays(&mut self) {
        if self.dirty {
            // Apply overlays.
            rgba32_to_rgb8_in_place(&self.board32, &mut self.board8_without_cursor);
            // Clear overlays.
            self.board32.copy_from_slice(&self.board32_zeros);
            // Clean.
            self.dirty = false;
        }
    }

    pub fn blit_cursor(&mut self, buffer: &RgbaBuffer) -> &[u8] {
        self.apply_overlays();
        // Copy all changes.
        self.board8_final.copy_from_slice(&self.board8_without_cursor);
        // Blit cursor.

        // Copy cleared overlay.
        self.board32_final.copy_from_slice(&self.board32);
        // Blit.
        overlay_rgba32(&buffer.buffer, &buffer.rect.size, &mut self.board32, &buffer.rect.position, &BOARD_SIZE);
        &self.board8_final
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
