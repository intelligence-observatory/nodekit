use crate::*;
use blittle::overlay::*;
use blittle::stride::RGBA;
use blittle::{PositionI, Size, clip};
use bytemuck::cast_slice;
use nodekit_rs_models::Position;

const CURSOR_SIZE: Size = Size { w: 34, h: 44 };

/// A cursor icon.
pub struct Cursor(pub Vec<Vec4>);

impl Cursor {
    pub const fn rect(position: Position) -> Rect {
        let position = PositionI {
            x: spatial_coordinate(position.x),
            y: spatial_coordinate(position.y),
        };
        let mut size = CURSOR_SIZE;
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Rect { position, size }
    }
}

impl Default for Cursor {
    fn default() -> Self {
        let buffer = cast_slice::<u8, [u8; RGBA]>(include_bytes!("../cursor"))
            .iter()
            .map(|pixel| rgba8_to_rgba32_color(pixel))
            .collect();
        Self(buffer)
    }
}
