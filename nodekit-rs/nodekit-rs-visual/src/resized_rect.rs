use crate::{size_coordinate, spatial_coordinate};
use blittle::{PositionI, Size};
use nodekit_rs_models::Rect;

pub struct ResizedRect {
    pub position: PositionI,
    pub size: Size,
}

impl ResizedRect {
    pub fn new(rect: &Rect, src_width: u32, src_height: u32) -> Self {
        let dst_size = Size {
            w: size_coordinate(rect.size.w),
            h: size_coordinate(rect.size.h),
        };
        let mut position = PositionI {
            x: spatial_coordinate(rect.position.x),
            y: spatial_coordinate(rect.position.y),
        };
        let src_size = Self::get_resized(
            &Size {
                w: src_width as usize,
                h: src_height as usize,
            },
            &dst_size,
        );

        if src_size.w < dst_size.w {
            position.x += (dst_size.w / 2 - src_size.w / 2).cast_signed();
        }
        if src_size.h < dst_size.h {
            position.y += (dst_size.h / 2 - src_size.h / 2).cast_signed();
        }
        Self {
            position,
            size: src_size,
        }
    }

    fn get_resized(src: &Size, dst: &Size) -> Size {
        let rw = src.w as f64 / dst.w as f64;
        let rh = src.h as f64 / dst.h as f64;
        if rw > rh {
            Size {
                w: dst.w,
                h: (src.h as f64 / rw) as usize,
            }
        } else {
            Size {
                w: (src.w as f64 / rh) as usize,
                h: dst.h,
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_resized() {
        let src = Size { w: 400, h: 200 };
        let dst = Size { w: 1920, h: 720 };
        let size = ResizedRect::get_resized(&src, &dst);
        assert_eq!(size.w, 1440);
        assert_eq!(size.h, 720);

        let dst = Size { w: 720, h: 1920 };
        let size = ResizedRect::get_resized(&src, &dst);
        assert_eq!(size.w, 720);
        assert_eq!(size.h, 360);

        let dst = Size { w: 1920, h: 720 };
        let size = ResizedRect::get_resized(&src, &dst);
        assert_eq!(size.w, 1440);
        assert_eq!(size.h, 720);

        let src = Size { w: 400, h: 400 };
        let size = ResizedRect::get_resized(&src, &dst);
        assert_eq!(size.w, 720);
        assert_eq!(size.h, 720);
    }
}
