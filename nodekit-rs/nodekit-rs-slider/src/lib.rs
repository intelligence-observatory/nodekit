mod error;
mod thumb;
mod thumb_color;

use blittle::Size;
use blittle::overlay::{Vec4, rgba8_to_rgba32};
pub use error::Error;
use nine_slice::{BorderOffsets, BorderScaling, NineSlicedSprite, fast_image_resize};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::{Board, RgbaBuffer, UnclippedRect};
use thumb::Thumb;

const TICK_COLOR: Vec4 = Vec4::new(182. / 255., 183. / 255., 184. / 255., 1.);

/// The visual representation of a Slider model.
pub struct Slider {
    /// The background bitmap.
    track: RgbaBuffer,
    /// The foreground bitmap that can be moved.
    thumb: Thumb,
}

impl Slider {
    pub fn new(
        region: &Region,
        slider: &nodekit_rs_models::card::Slider,
    ) -> Result<Option<Self>, Error> {
        Ok(Self::get_track(region, slider)?.map(|track| {
            let thumb = Thumb::new(region, slider.num_bins, &slider.orientation);
            Self { track, thumb }
        }))
    }

    pub fn blit(&self, slider: &nodekit_rs_models::card::Slider, board: &mut Board) {
        board.overlay_rgba(&self.track);
        self.thumb.overlay(slider.bin, slider.committed, board);
    }

    fn get_track(
        region: &Region,
        slider: &nodekit_rs_models::card::Slider,
    ) -> Result<Option<RgbaBuffer>, Error> {
        let mut rect = UnclippedRect::new(region);
        // Shrink.
        match &slider.orientation {
            SliderOrientation::Horizontal => {
                let h = (rect.size.h as f32 * 0.7) as usize;
                rect.position.y += (rect.size.h - h).cast_signed() / 2;
                rect.size.h = h;
            }
            SliderOrientation::Vertical => {
                let w = (rect.size.w as f32 * 0.7) as usize;
                rect.position.x += (rect.size.w - w).cast_signed() / 2;
                rect.size.w = w;
            }
        }
        match rect.into_clipped_rect(BOARD_SIZE) {
            Some(rect) => {
                let track = fast_image_resize::images::Image::from_vec_u8(
                    17,
                    17,
                    include_bytes!("../track.raw").to_vec(),
                    fast_image_resize::PixelType::U8x4,
                )
                .map_err(Error::RawTrack)?;
                let border_offsets = BorderOffsets {
                    left: 8,
                    top: 8,
                    right: 8,
                    bottom: 8,
                };
                let mut sprite =
                    NineSlicedSprite::new(track, border_offsets, BorderScaling::Stretch)
                        .map_err(Error::NineSlice)?;
                let text_background = sprite
                    .resize(region.w as u32, region.h as u32)
                    .map_err(Error::NineSlice)?;
                let mut buffer = rgba8_to_rgba32(text_background.buffer());

                if slider.show_bin_markers {
                    Self::draw_ticks(slider, rect.src_size, &mut buffer);
                }

                Ok(Some(RgbaBuffer { buffer, rect }))
            }
            None => Ok(None),
        }
    }

    fn draw_ticks(slider: &nodekit_rs_models::card::Slider, size: Size, buffer: &mut [Vec4]) {
        match &slider.orientation {
            SliderOrientation::Horizontal => {
                Self::draw_ticks_horizontal(slider.num_bins, size, buffer)
            }
            SliderOrientation::Vertical => Self::draw_ticks_vertical(slider.num_bins, size, buffer),
        }
    }

    fn draw_ticks_horizontal(num_bins: usize, size: Size, buffer: &mut [Vec4]) {
        let h = (size.h as f32 * 0.7) as usize;
        let y = (size.h as f32 * 0.15) as usize;
        let num_ticks = num_bins - 2;
        let dx = size.w / num_ticks;
        for ix in 0..num_ticks {
            let x = dx * ix + 1;
            for y in y..y + h {
                let i = x + y * size.w;
                buffer[i] = TICK_COLOR;
            }
        }
    }

    fn draw_ticks_vertical(num_bins: usize, size: Size, buffer: &mut [Vec4]) {
        let w = (size.w as f32 * 0.7) as usize;
        let x = (size.w as f32 * 0.15) as usize;
        let num_ticks = num_bins - 2;
        let dy = size.h / num_ticks;
        let tick = vec![TICK_COLOR; w];
        for iy in 0..num_ticks {
            let y = dy * iy + 1;
            let i = x + y * size.w;
            buffer[i..i + w].copy_from_slice(&tick);
        }
    }
}
