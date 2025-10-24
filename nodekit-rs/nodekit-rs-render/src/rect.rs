use crate::board::*;
use crate::card_rect::CardRect;
use blittle::*;

#[derive(Default)]
pub struct Rect {
    pub position: PositionU,
    pub size: Size,
}

impl Rect {
    pub const fn spatial_coordinate(c: f64) -> isize {
        (BOARD_D_HALF_F64 + BOARD_D_F64 * c) as isize
    }

    pub const fn size_coordinate(c: f64) -> usize {
        (BOARD_D_F64 * c) as usize
    }
}

impl From<CardRect> for Rect {
    fn from(value: CardRect) -> Self {
        let position = PositionI {
            x: Self::spatial_coordinate(value.x),
            y: Self::spatial_coordinate(value.y),
        };
        let mut size = Size {
            w: Self::size_coordinate(value.w),
            h: Self::size_coordinate(value.h),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self { position, size }
    }
}
