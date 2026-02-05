//! Constants used to define the board's size.

use blittle::{PixelType, Size};

macro_rules! dim {
    ($name:ident, $value:literal) => {
        pub const $name: BoardDimension = BoardDimension {
            u_size: $value,
            i_size_half: $value / 2,
        };
    };
}

/// A dimension of the board that images are rendered to.
pub struct BoardDimension {
    pub u_size: usize,
    pub i_size_half: isize,
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
