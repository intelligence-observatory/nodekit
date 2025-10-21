use blittle::*;
use nodekit_rs_board::{BOARD_D_F64, BOARD_D_HALF_F64, BOARD_SIZE};

#[derive(Default)]
pub struct Rect {
    pub position: PositionU,
    pub size: Size,
}

impl Rect {
    pub fn new(x: f64, y: f64, w: f64, h: f64) -> Self {
        let position = PositionI {
            x: Self::spatial_coordinate(x),
            y: Self::spatial_coordinate(y),
        };
        let mut size = Size {
            w: Self::size_coordinate(w),
            h: Self::size_coordinate(h),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self { position, size }
    }

    const fn spatial_coordinate(c: f64) -> isize {
        (BOARD_D_HALF_F64 + BOARD_D_F64 * c) as isize
    }

    const fn size_coordinate(c: f64) -> usize {
        (BOARD_D_F64 * c) as usize
    }
}
