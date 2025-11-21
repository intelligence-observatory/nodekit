use super::RgbaRange;
use crate::resized_rect::ResizedRect;
use blittle::*;

#[derive(Default, Debug)]
pub struct RgbaRect {
    /// Top left.
    pub xy0: PositionU,
    /// Bottom right.
    pub xy1: PositionU,
}

/// A rect with coordinates that can be used to blit an RGBA bitmap to an RGB bitmap.
#[derive(Default, Debug)]
pub struct RgbaRects {
    pub src: RgbaRect,
    pub dst: RgbaRect,
}

impl RgbaRects {
    pub const fn new(src_rect: &ResizedRect) -> Option<Self> {
        if let Some(xs) = RgbaRange::new(src_rect.position.x, src_rect.size.w)
            && let Some(ys) = RgbaRange::new(src_rect.position.y, src_rect.size.h)
        {
            let src = RgbaRect {
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
            let dst = RgbaRect {
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
