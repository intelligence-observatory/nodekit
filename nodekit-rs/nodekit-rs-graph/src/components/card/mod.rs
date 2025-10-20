mod asset;
mod text;

pub use asset::*;
use blittle::*;
use nodekit_rs_board::{BOARD_D_F32, BOARD_D_HALF_F32, BOARD_SIZE};
use slotmap::new_key_type;
pub use text::*;

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

impl<'c> From<&nodekit_rs_fb::Card<'c>> for Card {
    fn from(value: &nodekit_rs_fb::Card<'c>) -> Self {
        let position = PositionI {
            x: Self::spatial_coordinate(value.x()),
            y: Self::spatial_coordinate(value.y()),
        };
        let mut size = Size {
            w: Self::size_coordinate(value.w()),
            h: Self::size_coordinate(value.h()),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self { position, size }
    }
}
