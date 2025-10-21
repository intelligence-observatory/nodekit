mod text;
mod video;
mod image;

use blittle::*;
use nodekit_rs_board::*;
use slotmap::new_key_type;
pub use image::*;
pub use text::*;
pub use video::*;

new_key_type! { pub struct CardKey; }

pub struct Card {
    pub position: PositionU,
    pub size: Size,
}

impl Card {
    pub const fn spatial_coordinate(c: f32) -> isize {
        (BOARD_D_HALF_F32 + BOARD_D_F32 * c) as isize
    }

    pub const fn size_coordinate(c: f32) -> usize {
        (BOARD_D_F32 * c) as usize
    }
}
