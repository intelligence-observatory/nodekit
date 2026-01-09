use blittle::overlay::*;
use blittle::{ClippedRect, Size};
use bytemuck::cast_slice;
use nodekit_rs_models::board::*;
use nodekit_rs_models::Region;

const CURSOR_SIZE: Size = Size { w: 34, h: 44 };

/// A cursor icon.
pub struct Cursor(pub Vec<Vec4>);

impl Cursor {
    pub const fn rect(x: i64, y: i64) -> Option<ClippedRect> {
        let position = Region::position(x, y);
        let size = CURSOR_SIZE;
        ClippedRect::new(position, BOARD_SIZE, size)
    }
}

impl Default for Cursor {
    fn default() -> Self {
        let buffer = cast_slice::<u8, RgbaColor>(include_bytes!("../cursor"))
            .iter()
            .map(rgba8_to_rgba32_color)
            .collect();
        Self(buffer)
    }
}
