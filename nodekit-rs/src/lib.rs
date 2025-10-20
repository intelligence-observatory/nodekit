mod state;
mod video;

use blittle::Size;

pub(crate) const BOARD_D: usize = 768;
pub(crate) const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};
pub(crate) type Board = [u8; BOARD_D * BOARD_D * 3];
