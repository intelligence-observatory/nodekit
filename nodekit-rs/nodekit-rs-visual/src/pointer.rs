use blittle::overlay::*;
use blittle::{ClippedRect, Size};
use bytemuck::cast_slice;
use nodekit_rs_models::Region;
use nodekit_rs_models::board::*;

const POINTER_SIZE: Size = Size { w: 25, h: 33 };

/// A pointer icon.
pub struct Pointer(pub Vec<Vec4>);

impl Pointer {
    pub const fn rect(x: i64, y: i64) -> Option<ClippedRect> {
        let position = Region::position(x, y);
        let size = POINTER_SIZE;
        ClippedRect::new(position, BOARD_SIZE, size)
    }
}

impl Default for Pointer {
    fn default() -> Self {
        let buffer = cast_slice::<u8, RgbaColor>(include_bytes!("../pointer"))
            .iter()
            .map(rgba8_to_rgba32_color)
            .collect();
        Self(buffer)
    }
}
