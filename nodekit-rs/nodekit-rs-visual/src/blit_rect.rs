use crate::ResizedRect;
use crate::board::{BOARD_SIZE, size_coordinate, spatial_coordinate};
use blittle::*;
use nodekit_rs_models::Rect;

/// A rect with coordinates that can be used to blit to a pixel bitmap.
pub struct BlitRect {
    pub position: PositionU,
    pub size: Size,
}

impl From<Rect> for BlitRect {
    fn from(value: Rect) -> Self {
        // Clip.
        let position = PositionI {
            x: spatial_coordinate(value.position.x),
            y: spatial_coordinate(value.position.y),
        };
        let mut size = to_blittle_size(&value.size);
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self { position, size }
    }
}

impl From<ResizedRect> for BlitRect {
    fn from(value: ResizedRect) -> Self {
        let mut size = value.size;
        let position = clip(&value.position, &BOARD_SIZE, &mut size);
        Self { size, position }
    }
}

pub const fn to_blittle_size(size: &nodekit_rs_models::Size) -> Size {
    Size {
        w: size_coordinate(size.w),
        h: size_coordinate(size.h),
    }
}
