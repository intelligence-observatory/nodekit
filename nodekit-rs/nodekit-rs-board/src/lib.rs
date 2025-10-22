//! Board-related constants and converters.

use blittle::*;

pub const BOARD_D: usize = 768;
pub const BOARD_D_F64: f64 = 768.;
pub const BOARD_D_HALF_F64: f64 = 384.;
pub const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};

pub fn board() -> Vec<u8> {
    vec![0; BOARD_D * BOARD_D * 3]
}
