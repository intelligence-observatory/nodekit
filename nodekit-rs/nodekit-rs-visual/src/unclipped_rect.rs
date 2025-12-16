use crate::{size_coordinate, spatial_coordinate};
use blittle::{ClippedRect, PositionI, Size};
use nodekit_rs_models::Region;

#[derive(Clone, Debug)]
pub struct UnclippedRect {
    pub position: PositionI,
    pub size: Size,
}

impl UnclippedRect {
    pub const fn new(region: &Region) -> Self {
        Self {
            position: PositionI {
                x: spatial_coordinate(region.x),
                y: spatial_coordinate(region.y),
            },
            size: Size {
                w: size_coordinate(region.w),
                h: size_coordinate(region.h),
            },
        }
    }

    /// Resize to fit within `card_size`.
    pub const fn resize(&mut self, card_size: &Size) {
        let rw = self.size.w as f64 / card_size.w as f64;
        let rh = self.size.h as f64 / card_size.h as f64;
        self.size = if rw > rh {
            Size {
                w: card_size.w,
                h: (self.size.h as f64 / rw) as usize,
            }
        } else {
            Size {
                w: (self.size.w as f64 / rh) as usize,
                h: card_size.h,
            }
        };

        if self.size.w < card_size.w {
            self.position.x += (card_size.w / 2 - self.size.w / 2).cast_signed();
        }
        if self.size.h < card_size.h {
            self.position.y += (card_size.h / 2 - self.size.h / 2).cast_signed();
        }
    }

    pub const fn into_clipped_rect(self, dst_size: Size) -> Option<ClippedRect> {
        ClippedRect::new(self.position, dst_size, self.size)
    }
}

impl From<Size> for UnclippedRect {
    fn from(value: Size) -> Self {
        Self {
            position: PositionI::default(),
            size: value,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unclipped_rect() {
        let mut src = UnclippedRect::from(Size { w: 400, h: 200 });
        src.resize(&Size { w: 1920, h: 720 });
        assert_eq!(src.size.w, 1440);
        assert_eq!(src.size.h, 720);

        src = UnclippedRect::from(Size { w: 400, h: 200 });
        src.resize(&Size { w: 720, h: 1920 });
        assert_eq!(src.size.w, 720);
        assert_eq!(src.size.h, 360);

        src = UnclippedRect::from(Size { w: 400, h: 200 });
        src.resize(&Size { w: 1920, h: 720 });
        assert_eq!(src.size.w, 1440);
        assert_eq!(src.size.h, 720);

        src = UnclippedRect::from(Size { w: 400, h: 400 });
        src.resize(&Size { w: 1920, h: 720 });
        assert_eq!(src.size.w, 720);
        assert_eq!(src.size.h, 720);
    }
}
