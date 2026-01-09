//! Constants used to define the board's size.

use blittle::{PixelType, Size};

macro_rules! dim {
    ($name:ident, $value:literal) => {
        pub const $name: BoardDimension = BoardDimension {
            u_size: $value,
            u_32: $value,
            i_size: $value,
            i_64: $value,
            i_size_half: $value / 2,
            i_64_half: $value / 2,
            f_64: $value as f64,
        };
    };
}

/// A dimension of the board that images are rendered to.
/// We need the number to be in different types (usize, u32, etc.) depending on the operation,
/// and we need to do that "cast" frequently, so we'll just cache them here.
/// See the `dim!` macro for how we avoid making mistakes.
pub struct BoardDimension {
    pub u_size: usize,
    pub u_32: u32,
    pub i_size: isize,
    pub i_64: i64,
    pub i_size_half: isize,
    pub i_64_half: i64,
    pub f_64: f64,
}

dim!(HORIZONTAL, 1024);
dim!(VERTICAL, 1024);

pub const BOARD_SIZE: Size = Size {
    w: HORIZONTAL.u_size,
    h: VERTICAL.u_size,
};
pub const PIXEL_TYPE: PixelType = PixelType::Rgb8;
pub const STRIDE: usize = PIXEL_TYPE.stride();
pub type RgbColor = [u8; STRIDE];
pub type RgbaColor = [u8; PixelType::Rgba8.stride()];
