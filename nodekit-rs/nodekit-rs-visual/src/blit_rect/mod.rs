mod rgb;
mod rgba;
mod rgba_range;

use crate::board::*;
use blittle::Size;
pub use rgb::RgbRect;
pub use rgba::RgbaRect;

const fn to_blittle_size(size: &nodekit_rs_models::Size) -> Size {
    Size {
        w: size_coordinate(size.w),
        h: size_coordinate(size.h),
    }
}
