//! Various constants used to describe the size of the visual board.

use blittle::*;

pub const VISUAL_D: usize = 768;
pub const VISUAL_D_U32: u32 = 768;
pub const VISUAL_D_ISIZE: isize = 768;
pub const VISUAL_D_F64: f64 = 768.;
pub const VISUAL_D_F64_HALF: f64 = 384.;
pub const VISUAL_SIZE: Size = Size {
    w: VISUAL_D,
    h: VISUAL_D,
};
pub const STRIDE: usize = stride::RGB;

/// Convert a value between -0.5 and 0.5 into a pixel coordinate.
pub const fn spatial_coordinate(c: f64) -> isize {
    (VISUAL_D_F64_HALF + VISUAL_D_F64 * c) as isize
}

/// Convert a value between 0 and 1 into a pixel coordinate.
pub const fn size_coordinate(c: f64) -> usize {
    (VISUAL_D_F64 * c) as usize
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_board_constants() {
        assert_eq!(VISUAL_D, VISUAL_D_U32 as usize);
        assert_eq!(VISUAL_D, VISUAL_D_ISIZE as usize);
        assert_eq!(VISUAL_D, VISUAL_D_F64 as usize);
        assert_eq!(VISUAL_D / 2, VISUAL_D_F64_HALF as usize);
    }

    #[test]
    fn test_coordinates() {
        assert_eq!(spatial_coordinate(0.), VISUAL_D_ISIZE / 2);
        assert_eq!(spatial_coordinate(-0.5), 0);
        assert_eq!(spatial_coordinate(0.5), VISUAL_D_ISIZE);

        assert_eq!(spatial_coordinate(0.), 0);
        assert_eq!(spatial_coordinate(1.), VISUAL_D_ISIZE);
    }
}
