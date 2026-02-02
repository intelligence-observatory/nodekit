use blittle::ClippedRect;
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::UnclippedRect;

pub struct SliderRects {
    /// The rect of the track + the thumb.
    pub total: ClippedRect,
    /// The rect of the track.
    pub track: ClippedRect,
}

impl SliderRects {
    pub fn new(region: &Region, slider: &nodekit_rs_models::card::Slider) -> Option<Self> {
        let mut unclipped = UnclippedRect::new(region);
        let total = unclipped.clone().into_clipped_rect(BOARD_SIZE)?;
        // Shrink the total area to fit the track.
        match &slider.orientation {
            SliderOrientation::Horizontal => {
                let h = (unclipped.size.h as f32 * 0.7) as usize;
                unclipped.position.y += (unclipped.size.h - h).cast_signed() / 2;
                unclipped.size.h = h;
            }
            SliderOrientation::Vertical => {
                let w = (unclipped.size.w as f32 * 0.7) as usize;
                unclipped.position.x += (unclipped.size.w - w).cast_signed() / 2;
                unclipped.size.w = w;
            }
        }
        let track = unclipped.into_clipped_rect(BOARD_SIZE)?;
        Some(Self { total, track })
    }
}
