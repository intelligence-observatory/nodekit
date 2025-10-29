use blittle::*;
use nodekit_rs_visual::*;

#[derive(Copy, Clone, Default)]
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
        let position = clip(&position, &VISUAL_SIZE, &mut size);
        Self { position, size }
    }

    pub const fn contains(&self, x: f32, y: f32) -> bool {
        let x = Self::spatial_coordinate(x as f64);
        let y = Self::spatial_coordinate(y as f64);
        if x < 0 || y < 0 {
            false
        } else {
            let x = x.cast_unsigned();
            let y = y.cast_unsigned();
            x >= self.position.x
                && x < self.position.x + self.size.w
                && y >= self.position.y
                && y < self.position.y + self.size.h
        }
    }

    pub const fn spatial_coordinate(c: f64) -> isize {
        (VISUAL_D_F64_HALF + VISUAL_D_F64 * c) as isize
    }

    pub const fn size_coordinate(c: f64) -> usize {
        (VISUAL_D_F64 * c) as usize
    }
}
