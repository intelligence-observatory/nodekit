use blittle::overlay::Vec4;
use blittle::{get_index, ClippedRect, PositionI, Size};
use nodekit_rs_models::card::{SliderOrientation, ThumbState};
use nodekit_rs_models::Region;
use nodekit_rs_visual::{Board, UnclippedRect};
use crate::S;
use crate::thumb_color::{COMMITTED, UNCOMMITTED};

const D: usize = 8;

pub struct Thumb {
    pub buffer: Vec<Vec4>,
    pub size: Size,
    pub rects: Vec<Option<ClippedRect>>,
}

impl Thumb {
    pub fn new(region: &Region, num_bins: usize, orientation: &SliderOrientation, thumb_state: &ThumbState) -> Self {
        let size = match orientation {
            SliderOrientation::Horizontal => Size {
                w: D,
                h: (region.h as f32 * S) as usize,
            },
            SliderOrientation::Vertical => Size {
                w: (region.w as f32 * S) as usize,
                h: D
            }
        };
        let color = match thumb_state {
            ThumbState::Uncommitted => UNCOMMITTED,
            ThumbState::Committed => COMMITTED
        };
        let mut buffer = vec![color.fill; size.w * size.h];
        // Top-left.
        buffer[0] = color.far_corner;
        buffer[get_index(0, 1, size.w, 4)] = color.near_corner;
        buffer[get_index(1, 0, size.w, 4)] = color.near_corner;
        // Top-right.
        buffer[get_index(size.w - 1, 0, size.w, 4)] = color.far_corner;
        buffer[get_index(size.w - 2, 0, size.w, 4)] = color.near_corner;
        buffer[get_index(size.w - 1, 1, size.w, 4)] = color.near_corner;
        // Bottom-right.
        buffer[get_index(size.w - 1, size.h - 1, size.w, 4)] = color.far_corner;
        buffer[get_index(size.w - 2, size.h - 1, size.w, 4)] = color.near_corner;
        buffer[get_index(size.w - 1, size.h - 2, size.w, 4)] = color.near_corner;
        // Bottom-left.
        buffer[get_index(0, size.h - 1, size.w, 4)] = color.far_corner;
        buffer[get_index(0, size.h - 1, size.w, 4)] = color.near_corner;
        buffer[get_index(1, size.h - 2, size.w, 4)] = color.near_corner;

        let rects = match orientation {
            SliderOrientation::Horizontal => Self::get_horizontal_rects(region, num_bins, size),
            SliderOrientation::Vertical => Self::get_vertical_rects(region, num_bins, size),
        };
        Self {
            buffer,
            size,
            rects,
        }
    }

    pub fn overlay(&self, bin: usize, board: &mut Board) {
        // Try to get the rect corresponding to `bin`.
        if let Some(Some(rect)) = self.rects.get(bin) {
            // Overlay the thumb at `rect`.
            board.overlay_rgba_raw(&self.buffer, rect);
        }
    }

    fn get_horizontal_rects(region: &Region, num_bins: usize, size: Size) -> Vec<Option<ClippedRect>> {
        let region_rect = UnclippedRect::new(region);
        let dx = (region_rect.size.w / num_bins - num_bins * size.w / 2).cast_signed();
        (0..num_bins.cast_signed()).map(|b| {
            ClippedRect::new(PositionI {
                x: region_rect.position.x - region_rect.size.w.cast_signed() / 2 + dx * b,
                y: region_rect.position.y,
            }, region_rect.size, size)
        }).collect()
    }

    fn get_vertical_rects(region: &Region, num_bins: usize, size: Size) -> Vec<Option<ClippedRect>> {
        let region_rect = UnclippedRect::new(region);
        let dy = (region_rect.size.h / num_bins - num_bins * size.h / 2).cast_signed();
        (0..num_bins.cast_signed()).map(|b| {
            ClippedRect::new(PositionI {
                x: region_rect.position.x,
                y: region_rect.position.x - region_rect.size.w.cast_signed() / 2 + dy * b,
            }, region_rect.size, size)
        }).collect()
    }
}