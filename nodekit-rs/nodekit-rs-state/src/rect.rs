use blittle::*;
use nodekit_rs_board::*;

#[derive(Copy, Clone, Default)]
pub struct Rect {
    pub position: PositionU,
    pub size: Size,
}

impl Rect {
    pub fn new(x: f64, y: f64, w: f64, h: f64) -> Self {
        let position = PositionI {
            x: spatial_coordinate(x),
            y: spatial_coordinate(y),
        };
        let mut size = Size {
            w: size_coordinate(w),
            h: size_coordinate(h),
        };
        let position = clip(&position, &VISUAL_SIZE, &mut size);
        Self { position, size }
    }

    pub const fn contains(&self, x: f32, y: f32) -> bool {
        let x = spatial_coordinate(x as f64);
        let y = spatial_coordinate(y as f64);
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
}
