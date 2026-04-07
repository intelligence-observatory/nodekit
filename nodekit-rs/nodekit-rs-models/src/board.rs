//! Constants used to define the board's size.

use blittle::{PixelType, Size};

pub const HORIZONTAL: usize = 1024;
pub const VERTICAL: usize = 1024;

pub const BOARD_SIZE: Size = Size {
    w: HORIZONTAL,
    h: VERTICAL,
};
pub const PIXEL_TYPE: PixelType = PixelType::Rgb8;
pub const STRIDE: usize = PIXEL_TYPE.stride();
pub type RgbColor = [u8; STRIDE];
pub type RgbaColor = [u8; PixelType::Rgba8.stride()];
