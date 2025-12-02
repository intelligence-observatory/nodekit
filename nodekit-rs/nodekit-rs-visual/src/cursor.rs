use blittle::{clip, PositionI, Size};
use blittle::overlay::Vec4;
use blittle::stride::RGBA;
use bytemuck::cast_slice;
use nodekit_rs_models::Position;
use crate::*;

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
        Rect {
            position,
            size
        }
    }
}

impl Default for Cursor {
    fn default() -> Self {
        let buffer = cast_slice::<u8, [u8; RGBA]>(include_bytes!("../cursor")).iter().map(|pixel| {
            Vec4::new(pixel[0] as f32 * 255., pixel[1] as f32 * 255., pixel[2] as f32 * 255., pixel[3] as f32 * 255.)
        }).collect();
        Self(buffer)
    }
}