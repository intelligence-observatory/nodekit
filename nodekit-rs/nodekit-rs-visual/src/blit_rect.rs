use blittle::*;
use nodekit_rs_models::Rect;
use crate::board::{size_coordinate, spatial_coordinate, BOARD_SIZE};

pub struct BlitRect {
    pub position: PositionU,
    pub size: Size
}

impl From<Rect> for BlitRect {
    fn from(value: Rect) -> Self {
        // Clip.
        let position = PositionI {
            x: spatial_coordinate(value.position.x),
            y: spatial_coordinate(value.position.y),
        };
        let mut size = Size {
            w: size_coordinate(value.size.w),
            h: size_coordinate(value.size.h),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self {
            position,
            size
        }
    }
}