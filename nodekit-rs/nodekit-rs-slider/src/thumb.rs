use crate::get_index;
use crate::thumb_color::{COMMITTED, UNCOMMITTED};
use blittle::overlay::Vec4;
use blittle::{ClippedRect, PositionI, Size};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::{Board, UnclippedRect};

const D: usize = 8;

pub struct Thumb {
    pub committed: Vec<Vec4>,
    pub uncommitted: Vec<Vec4>,
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
            SliderOrientation::Horizontal => Self::get_horizontal_rects(region, num_bins, size),
            SliderOrientation::Vertical => Self::get_vertical_rects(region, num_bins, size),
        };
        Self {
            committed,
            uncommitted,
            rects,
        }
    }

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

    fn get_horizontal_rects(
        region: &Region,
        num_bins: usize,
        size: Size,
    ) -> Vec<Option<ClippedRect>> {
        let region_rect = UnclippedRect::new(region);
        let num_bins = num_bins.cast_signed();
        let dx = region_rect.size.w.cast_signed() / (num_bins - 1);
        let w = size.w.cast_signed();
        (0..num_bins)
            .map(|b| {
                let mut x = region_rect.position.x + dx * b;
                // Offset by the width of the thumb.
                if b > 0 {
                    x -= if b == num_bins - 1 { w } else { w / 2 };
                }
                ClippedRect::new(
                    PositionI {
                        x,
                        y: region_rect.position.y,
                    },
                    BOARD_SIZE,
                    size,
                )
            })
            .collect()
    }

    fn get_vertical_rects(
        region: &Region,
        num_bins: usize,
        size: Size,
    ) -> Vec<Option<ClippedRect>> {
        let region_rect = UnclippedRect::new(region);
        let num_bins = num_bins.cast_signed();
        let dy = region_rect.size.h.cast_signed() / (num_bins - 1);
        let h = size.h.cast_signed();
        (0..num_bins)
            .map(|b| {
                let mut y = region_rect.position.y + dy * b;
                // Offset by the width of the thumb.
                if b > 0 {
                    y -= if b == num_bins - 1 { h } else { h / 2 };
                }
                ClippedRect::new(
                    PositionI {
                        x: region_rect.position.x,
                        y,
                    },
                    BOARD_SIZE,
                    size,
                )
            })
            .collect()
    }
}
