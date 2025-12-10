use crate::*;
use blittle::overlay::*;
use blittle::stride::RGBA;
use blittle::{ClippedRect, PositionI, Size};
use bytemuck::cast_slice;

const CURSOR_SIZE: Size = Size { w: 34, h: 44 };

/// A cursor icon.
pub struct Cursor(pub Vec<Vec4>);

impl Cursor {
    pub const fn rect(region: &Region) -> Option<ClippedRect> {
        let position = PositionI {
            x: spatial_coordinate(region.x),
            y: spatial_coordinate(region.y),
        };
        let size = CURSOR_SIZE;
        ClippedRect::new(position, BOARD_SIZE, size)
    }
}

impl Default for Cursor {
    fn default() -> Self {
        let buffer = cast_slice::<u8, [u8; RGBA]>(include_bytes!("../cursor"))
            .iter()
            .map(rgba8_to_rgba32_color)
            .collect();
        Self(buffer)
    }
}
