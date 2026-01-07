//! Constants used to define the board's size.

use blittle::{PixelType, Size};

pub const BOARD_D: usize = 1024;
pub const BOARD_D_U32: u32 = 1024;
pub const BOARD_D_ISIZE: isize = 1024;
pub const BOARD_D_ISIZE_HALF: isize = 512;
pub const BOARD_D_F64: f64 = 1024.;
pub const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};
pub const PIXEL_TYPE: PixelType = PixelType::Rgb8;
pub const STRIDE: usize = PIXEL_TYPE.stride();
pub type RgbColor = [u8; STRIDE];

/// Convert a value between -BOARD_D / 2 and BOARD_D / 2 into a pixel coordinate.
pub const fn spatial_coordinate(c: i64) -> isize {
    BOARD_D_ISIZE_HALF + c as isize
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_board_constants() {
        assert_eq!(BOARD_D, BOARD_D_U32 as usize);
        assert_eq!(BOARD_D, BOARD_D_ISIZE as usize);
        assert_eq!(BOARD_D, BOARD_D_F64 as usize);
        assert_eq!(BOARD_D / 2, BOARD_D_ISIZE_HALF as usize);
    }

    #[test]
    fn test_coordinates() {
        assert_eq!(spatial_coordinate(0), BOARD_D_ISIZE_HALF);
        assert_eq!(spatial_coordinate(-BOARD_D_ISIZE_HALF as i64), 0);
        assert_eq!(spatial_coordinate(BOARD_D_ISIZE_HALF as i64), BOARD_D_ISIZE);
    }
}