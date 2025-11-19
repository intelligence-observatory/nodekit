//! Various constants used to describe the size of the visual board.

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
pub fn bitmap(width: usize, height: usize, color: [u8; STRIDE]) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * STRIDE];
    cast_slice_mut::<u8, [u8; STRIDE]>(&mut bitmap).fill(color);
    bitmap
}

/// Create a bitmap with the dimensions of the board.
pub fn board(color: [u8; STRIDE]) -> Vec<u8> {
    bitmap(BOARD_D, BOARD_D, color)
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
