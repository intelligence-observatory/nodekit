//! Various constants used to describe the size of the visual board.

use blittle::stride::RGBA;
use blittle::*;
use blittle::overlay::*;
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

/// Create a bitmap and fill it with a color.
pub fn bitmap_rgba(width: usize, height: usize, color: [u8; RGBA]) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * RGBA];
    cast_slice_mut::<u8, [u8; RGBA]>(&mut bitmap).fill(color);
    bitmap
}

pub struct Board {
    board8: Vec<u8>,
    board32: Vec<Vec4>,
    dirty: bool,
}

impl Board {
    pub fn new(color: [u8; STRIDE]) -> Self {
        // Create the boards.
        let board8 = bitmap_rgb(BOARD_D, BOARD_D, color);
        let board32 = rgb8_to_rgba32(&board8);
        Self {
            board8,
            board32,
            dirty: false
        }
    }

    /// Blit RGB8 onto the board.
    pub fn blit_rgb8(&mut self, src: &[u8],
                     src_size: &Size,
                     dst_position: &PositionU) {
        // Apply the overlays.
        self.apply_overlays();
        // Then blit on top of them.
        blit(src, src_size, &mut self.board8, dst_position, &BOARD_SIZE, STRIDE);
    }

    /// Overlay `src` onto the board.
    /// Call `apply_overlays()` when all overlay operations are done.
    pub fn overlay_rgb8(&mut self, src: &[u8],
                                src_size: &Size,
                                dst_position: &PositionU, alpha: u8) {
        self.dirty = true;
        overlay_rgb8(src, src_size, &mut self.board32, dst_position, &BOARD_SIZE, alpha);
    }

    pub fn overlay_rgb8a(&mut self, src: &[u8],
                                   src_size: &Size,
                                   dst_position: &PositionU) {
        self.dirty = true;
        overlay_rgba8(src, src_size, &mut self.board32, dst_position, &BOARD_SIZE);
    }

    /// Overlay `src` onto the board.
    /// Call `apply_overlays()` when all overlay operations are done.
    pub fn overlay_rgba32(mut self, src: &[Vec4], src_size: &Size,
                       dst_position: &PositionU) {
        self.dirty = true;
        overlay_rgba32(src, src_size, &mut self.board32, dst_position, &BOARD_SIZE);
    }

    /// Apply all overlay operations to the board.
    pub fn apply_overlays(&mut self) {
        if self.dirty {
            self.dirty = false;
            rgba32_to_rgb8_in_place(&self.board32, &mut self.board8);
        }
    }

    pub fn get_board(&mut self) -> &[u8] {
        self.apply_overlays();
        &self.board8
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
