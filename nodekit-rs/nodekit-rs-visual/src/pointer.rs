use blittle::overlay::*;
use blittle::{ClippedRect, PositionI, PositionU, Size};
use bytemuck::cast_slice;
use nodekit_rs_models::Region;
use nodekit_rs_models::board::*;

const POINTER_SIZE: Size = Size { w: 25, h: 33 };

/// A pointer icon.
///
/// This is very similar to an RgbaBuffer except that:
///
/// - The `buffer` and the size of the `rect` are always the same.
/// - The position of the `rect` is expected to change, and is None if the pointer is out of bounds.
pub struct Pointer {
    pub buffer: Vec<Vec4>,
    pub rect: Option<ClippedRect>,
}

impl Pointer {
    /// Set the position of the rect, where `x` and `y` are in nodekit's coordinate space
    pub const fn set_rect(&mut self, x: i64, y: i64) {
        let position = Region::position(
            x,
            y,
            POINTER_SIZE.w.cast_signed(),
            POINTER_SIZE.h.cast_signed(),
        );
        let size = POINTER_SIZE;
        self.rect = ClippedRect::new(position, BOARD_SIZE, size);
    }
}

impl Default for Pointer {
    fn default() -> Self {
        let buffer = cast_slice::<u8, RgbaColor>(include_bytes!("../pointer"))
            .iter()
            .map(rgba8_to_rgba32_color)
            .collect();
        // By default, the pointer is in at the center of the board.
        let mut rect = ClippedRect::default();
        rect.src_size_clipped = POINTER_SIZE;
        rect.src_size = POINTER_SIZE;
        rect.dst_position = PositionI {
            x: HORIZONTAL.cast_signed() / 2,
            y: VERTICAL.cast_signed() / 2,
        };
        rect.dst_position_clipped = PositionU {
            x: HORIZONTAL / 2,
            y: VERTICAL / 2,
        };
        rect.dst_size = BOARD_SIZE;
        Self {
            buffer,
            rect: Some(rect),
        }
    }
}
