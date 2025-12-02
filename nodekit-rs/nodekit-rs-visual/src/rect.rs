use crate::ResizedRect;
use crate::board::{BOARD_SIZE, size_coordinate, spatial_coordinate};
use blittle::*;

#[derive(Clone)]
pub struct Rect {
    pub position: PositionU,
    pub size: Size,
}

impl From<nodekit_rs_models::Rect> for Rect {
    fn from(value: nodekit_rs_models::Rect) -> Self {
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

impl From<ResizedRect> for Rect {
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::board::*;

    #[test]
    fn test_blittle_size() {
        let mut a = nodekit_rs_models::Size { w: 0., h: 0. };
        let mut b = to_blittle_size(&a);
        assert_eq!(b.w, 0);
        assert_eq!(b.h, 0);

        a.w = 1.;
        a.h = 1.;
        b = to_blittle_size(&a);
        assert_eq!(b.w, BOARD_D);
        assert_eq!(b.h, BOARD_D);

        a.w = 0.5;
        a.h = 0.5;
        b = to_blittle_size(&a);
        assert_eq!(b.w, BOARD_D / 2);
        assert_eq!(b.h, BOARD_D / 2);
    }
}
