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
}
