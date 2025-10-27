use blittle::*;

pub const VISUAL_D: usize = 768;
pub const VISUAL_D_ISIZE: isize = 768;
pub const VISUAL_D_F64: f64 = 768.;
pub const VISUAL_D_F64_HALF: f64 = 384.;
pub const VISUAL_SIZE: Size = Size {
    w: VISUAL_D,
    h: VISUAL_D,
};
pub const STRIDE: usize = stride::RGB;

pub const fn spatial_coordinate(value: f64) -> isize {
    (VISUAL_D_F64_HALF + VISUAL_D_F64 * value) as isize
}

pub const fn size_coordinate(value: f64) -> usize {
    (VISUAL_D_F64 * value) as usize
}
