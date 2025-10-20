//! Board-related constants and converters.

use blittle::*;

pub const BOARD_D: usize = 768;
pub const BOARD_D_F32: f32 = 768.;
pub const BOARD_D_HALF_F32: f32 = 384.;
pub const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};
pub type Board = [u8; BOARD_D * BOARD_D * 3];
