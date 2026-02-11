use blittle::overlay::Vec4;
use blittle::{PositionU, Size};

const CORNER_D: usize = 8;
const CORNER_SRC_W: usize = 16;

#[derive(Copy, Clone, Debug)]
pub enum Corner {
    TopLeft,
    TopRight,
    BottomRight,
    BottomLeft,
}

impl Corner {
    const fn get_positions(&self, size: Size) -> (PositionU, PositionU){
        match self {
            Corner::TopLeft => (PositionU {
                x: 0,
                y: 0
            }, PositionU {
                x: 0,
                y: 0
            }),
            Corner::TopRight => (
                PositionU {
                    x: CORNER_SRC_W - CORNER_D,
                    y: 0,
                },
                PositionU {
                    x: size.w - CORNER_D,
                    y: 0,
                },
            ),
            Corner::BottomRight => (
                PositionU {
                    x: CORNER_SRC_W - CORNER_D,
                    y: CORNER_SRC_W - CORNER_D,
                },
                PositionU {
                    x: size.w - CORNER_D,
                    y: size.h - CORNER_D,
                },
            ),
            Corner::BottomLeft => (
                PositionU {
                    x: 0,
                    y: CORNER_SRC_W - CORNER_D,
                },
                PositionU {
                    x: 0,
                    y: size.h - CORNER_D,
                },
            ),
        }
    }

    pub fn round_corner(&self, size: Size, dst: &mut [Vec4]) {
        let (src_position, dst_position) = self.get_positions(size);
        Self::round_corner_at(src_position, dst_position, size.w, dst);
    }

    /// Set the alpha values of a corner such that it becomes a rounded corner.
    ///
    /// - `src_position` is the top-left position of the corner in the corner alpha values bitmap.
    /// - `dst_position` is the top-left position at which the alpha values will be applied.
    /// - `dst_width` is the width of `dst`.
    /// - `dst` is the destination bitmap.
    fn round_corner_at(
        src_position: PositionU,
        dst_position: PositionU,
        dst_width: usize,
        dst: &mut [Vec4],
    ) {
        // This is a 16x16 array of u8 values where each 8x8 quadrant is a corner's alpha values.
        // We are manually setting these values rather than 9-slice scaling a sprite
        // because this is *much* faster.
        // We can get away with it because we know that the background is always a uniform color.
        const CORNER_ALPHAS: &[u8] = include_bytes!("../16x16.raw");

        for y in 0..CORNER_D {
            let src_y = src_position.y + y;
            let dst_y = dst_position.y + y;
            for x in 0..CORNER_D {
                // Get the alpha from the source bitmap.
                let src_x = src_position.x + x;
                let src_i = src_x + src_y * CORNER_SRC_W;
                let src_a = CORNER_ALPHAS[src_i] as f32 / 255.;

                // Set the alpha.
                let dst_x = dst_position.x + x;
                let dst_i = dst_x + dst_y * dst_width;
                dst[dst_i].w *= src_a;
            }
        }
    }
}
