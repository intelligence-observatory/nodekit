use crate::get_index;
use crate::thumb_color::{COMMITTED, UNCOMMITTED};
use blittle::overlay::Vec4;
use blittle::{ClippedRect, PositionI, Size};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::{Board, UnclippedRect};

macro_rules! rects {
    ($region:ident, $num_bins:ident, $size:ident, $coordinate:ident, $other_coordinate:ident, $dimension:ident) => {{
        let region_rect = UnclippedRect::new($region);
        let num_bins = $num_bins.cast_signed();
        // Increment the coordinate's position by this delta per tick.
        let delta = region_rect.size.$dimension.cast_signed() / (num_bins - 1);
        let d = $size.$dimension.cast_signed();
        (0..num_bins)
            .map(|b| {
                let mut c = region_rect.position.$coordinate + delta * b;
                // Offset the coordinate depending on whether this is a start, end, or middle tick.
                if b > 0 {
                    c -= if b == num_bins - 1 { d } else { d / 2 };
                }
                ClippedRect::new(
                    PositionI {
                        $coordinate: c,
                        $other_coordinate: region_rect.position.$other_coordinate,
                    },
                    BOARD_SIZE,
                    $size,
                )
            })
            .collect()
    }};
}

const D: usize = 8;

/// The foreground bitmap.
pub struct Thumb {
    /// The bitmap of a committed thumb.
    pub committed: Vec<Vec4>,
    /// The bitmap of an uncommitted thumb.
    pub uncommitted: Vec<Vec4>,
    /// The rects at which a thumb bitmap can be rendered.
    /// This corresponds to slider bins.
    /// If the element is None, then the slider bin is beyond the board area.
    pub rects: Vec<Option<ClippedRect>>,
}

impl Thumb {
    pub fn new(region: &Region, num_bins: usize, orientation: &SliderOrientation) -> Self {
        let size = match orientation {
            SliderOrientation::Horizontal => Size {
                w: D,
                h: region.h.cast_unsigned() as usize,
            },
            SliderOrientation::Vertical => Size {
                w: region.w.cast_unsigned() as usize,
                h: D,
            },
        };

        let committed = Self::get_buffer(&size, true);
        let uncommitted = Self::get_buffer(&size, false);

        let rects = match orientation {
            SliderOrientation::Horizontal => rects!(region, num_bins, size, x, y, w),
            SliderOrientation::Vertical => rects!(region, num_bins, size, y, x, h),
        };
        Self {
            committed,
            uncommitted,
            rects,
        }
    }

    /// Get a thumb buffer with a given color.
    /// We know that the corners are rounded and that their radii is 2px.
    /// So, rather than nine-slice this sprite, we just set pixel values manually, which is faster.
    fn get_buffer(size: &Size, committed: bool) -> Vec<Vec4> {
        let color = if committed { COMMITTED } else { UNCOMMITTED };
        let mut buffer = vec![color.fill; size.w * size.h];
        // Top-left.
        buffer[0] = color.far_corner;
        buffer[get_index(0, 1, size.w)] = color.near_corner;
        buffer[get_index(1, 0, size.w)] = color.near_corner;
        // Top-right.
        buffer[get_index(size.w - 1, 0, size.w)] = color.far_corner;
        buffer[get_index(size.w - 2, 0, size.w)] = color.near_corner;
        buffer[get_index(size.w - 1, 1, size.w)] = color.near_corner;
        // Bottom-right.
        buffer[get_index(size.w - 1, size.h - 1, size.w)] = color.far_corner;
        buffer[get_index(size.w - 2, size.h - 1, size.w)] = color.near_corner;
        buffer[get_index(size.w - 1, size.h - 2, size.w)] = color.near_corner;
        // Bottom-left.
        buffer[get_index(0, size.h - 1, size.w)] = color.far_corner;
        buffer[get_index(1, size.h - 1, size.w)] = color.near_corner;
        buffer[get_index(0, size.h - 2, size.w)] = color.near_corner;
        buffer
    }

    /// Overlay the thumb onto the board.
    /// `bin` sets where, if at all, the thumb will render.
    /// `committed` sets which bitmap to use.
    pub fn overlay(&self, bin: usize, committed: bool, board: &mut Board) {
        // Try to get the rect corresponding to `bin`.
        if let Some(Some(rect)) = self.rects.get(bin) {
            // Overlay the thumb at `rect`.
            board.overlay_rgba_raw(
                if committed {
                    &self.committed
                } else {
                    &self.uncommitted
                },
                rect,
            );
        }
    }
}
