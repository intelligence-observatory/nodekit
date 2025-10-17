use blittle::*;
use nodekit_rs_board::*;
use nodekit_rs_fb::Graph;

pub struct Card {
    pub position: PositionU,
    pub size: Size,
}

impl Card {
    const fn as_coordinate(value: f32) -> f32 {
        BOARD_D_F32_HALF + BOARD_D_F32 * value
    }
}

impl<'c> From<&nodekit_rs_fb::Card<'c>> for Card {
    fn from(value: &nodekit_rs_fb::Card<'c>) -> Self {
        let position = PositionI {
            x: Self::as_coordinate(value.x()) as isize,
            y: Self::as_coordinate(value.y()) as isize
        };
        let mut size = Size {
            w: Self::as_coordinate(value.w()) as usize,
            h: Self::as_coordinate(value.h()) as usize
        };
        let position = clip(&position, &Size {
            w: BOARD_D,
            h: BOARD_D
        }, &mut size);
        Self {
            position,
            size
        }
    }
}