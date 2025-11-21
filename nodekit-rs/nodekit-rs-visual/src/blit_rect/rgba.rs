use crate::blit_rect::rgba_range::RgbaRange;
use crate::board::*;
use blittle::{PositionU, Size};
use nodekit_rs_models::Rect;

pub struct Region {
    /// Top left.
    pub xy0: PositionU,
    /// Bottom right.
    pub xy1: PositionU,
}

/// A rect with coordinates that can be used to blit an RGBA bitmap to an RGB bitmap.
pub struct RgbaRect {
    pub src: Region,
    pub dst: Region,
}

impl RgbaRect {
    pub const fn new(src_rect: &Rect) -> Option<Self> {
        let size = Size {
            w: size_coordinate(src_rect.size.w),
            h: size_coordinate(src_rect.size.h),
        };
        if let Some(xs) = RgbaRange::new(src_rect.position.x, size.w)
            && let Some(ys) = RgbaRange::new(src_rect.position.y, size.h)
        {
            let src = Region {
                xy0: PositionU {
                    x: xs.src_0,
                    y: ys.src_0,
                },
                xy1: {
                    PositionU {
                        x: xs.src_1,
                        y: ys.src_1,
                    }
                },
            };
            let dst = Region {
                xy0: PositionU {
                    x: xs.dst_0,
                    y: ys.dst_0,
                },
                xy1: {
                    PositionU {
                        x: xs.dst_1,
                        y: ys.dst_1,
                    }
                },
            };
            Some(Self { src, dst })
        } else {
            None
        }
    }
}
