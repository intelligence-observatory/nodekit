mod error;
mod slider_rects;
mod thumb;
mod thumb_color;

use blittle::overlay::{Vec4, rgba8_to_rgba32};
use blittle::{ClippedRect, Size};
pub use error::Error;
use nine_slices::{BorderOffsets, BorderScaling, NineSlicedSprite, fast_image_resize};
use nine_slices::fast_image_resize::ResizeAlg;
use nodekit_rs_models::Region;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::{Board, RgbaBuffer};
use slider_rects::SliderRects;
use thumb::Thumb;

const TICK_COLOR: Vec4 = Vec4::new(182. / 255., 183. / 255., 184. / 255., 1.);
/// The scaling factor of a tick marker.
const TICK_D_FACTOR: f32 = 0.7;
/// The positional offset factor of a tick marker.
const TICK_OFFSET_FACTOR: f32 = 0.15;
/// The border offsets of a nine-sliced slider track sprite.
const BORDER_OFFSETS: BorderOffsets = BorderOffsets {
    left: 8,
    top: 8,
    right: 8,
    bottom: 8,
};

/// The visual representation of a Slider model.
pub struct Slider {
    /// The background bitmap.
    track: RgbaBuffer,
    /// The foreground bitmap that can be moved.
    thumb: Thumb,
    /// The rect defining the total area of the slider (track + thumb). Used for erasing.
    pub rect: ClippedRect,
    /// The current bin. This is updated from the slider model.
    bin: usize,
    /// Determines the color of the thumb. This is updated from the slider model.
    committed: bool,
}

impl Slider {
    pub fn new(
        region: &Region,
        slider: &nodekit_rs_models::card::Slider,
    ) -> Result<Option<Self>, Error> {
        Ok(Self::get_track(region, slider)?.map(|(track, rect)| {
            let thumb = Thumb::new(region, slider.num_bins, &slider.orientation);
            Self {
                track,
                thumb,
                rect,
                bin: slider.bin,
                committed: slider.committed,
            }
        }))
    }

    /// Update stateful information from a slider model.
    pub const fn update(&mut self, slider: &nodekit_rs_models::card::Slider) {
        self.bin = slider.bin;
        self.committed = slider.committed;
    }

    pub fn blit(&self, board: &mut Board) {
        // Overlay the track.
        board.overlay_rgba(&self.track);
        // Try to overlay the thumb.
        self.thumb.overlay(self.bin, self.committed, board);
    }

    pub fn get_clones_of_overlays(&self) -> Vec<RgbaBuffer> {
        let mut buffers = vec![self.track.clone()];
        if let Some(rect) = self.thumb.rects[self.bin] {
            let thumb_buffer = if self.committed {
                self.thumb.committed.clone()
            } else {
                self.thumb.uncommitted.clone()
            };
            buffers.push(RgbaBuffer {
                buffer: thumb_buffer,
                rect,
            })
        }
        buffers
    }

    /// Get a bitmap of the background track.
    fn get_track(
        region: &Region,
        slider: &nodekit_rs_models::card::Slider,
    ) -> Result<Option<(RgbaBuffer, ClippedRect)>, Error> {
        match SliderRects::new(region, slider) {
            Some(rects) => {
                // Load the sliceable track image.
                let track = fast_image_resize::images::Image::from_vec_u8(
                    17,
                    17,
                    include_bytes!("../track.raw").to_vec(),
                    fast_image_resize::PixelType::U8x4,
                )
                .map_err(Error::RawTrack)?;
                // Get the sprite.
                let mut sprite =
                    NineSlicedSprite::new(track, BORDER_OFFSETS, BorderScaling::Stretch)
                        .map_err(Error::NineSlice)?;
                sprite.set_resize_algorithm(ResizeAlg::Nearest);
                // Resize the sprite.
                let image = sprite
                    .resize(rects.track.src_size.w as u32, rects.track.src_size.h as u32)
                    .map_err(Error::NineSlice)?;
                // Convert to an overlay.
                let mut buffer = rgba8_to_rgba32(image.buffer());
                // Draw tick markers.
                if slider.show_bin_markers {
                    Self::draw_ticks(slider, rects.track.src_size, &mut buffer);
                }

                Ok(Some((
                    RgbaBuffer {
                        buffer,
                        rect: rects.track,
                    },
                    rects.total,
                )))
            }
            None => Ok(None),
        }
    }

    /// Draw tick markers on the background track.
    fn draw_ticks(slider: &nodekit_rs_models::card::Slider, size: Size, buffer: &mut [Vec4]) {
        if slider.num_bins > 2 {
            match &slider.orientation {
                SliderOrientation::Horizontal => {
                    Self::draw_ticks_horizontal(slider.num_bins, size, buffer)
                }
                SliderOrientation::Vertical => {
                    Self::draw_ticks_vertical(slider.num_bins, size, buffer)
                }
            }
        }
    }

    /// Draw vertical ticks across a horizontal track.
    fn draw_ticks_horizontal(num_bins: usize, size: Size, buffer: &mut [Vec4]) {
        let h = (size.h as f32 * TICK_D_FACTOR) as usize;
        let y = (size.h as f32 * TICK_OFFSET_FACTOR) as usize;
        let dx = size.w / (num_bins - 1);
        for ix in 0..num_bins - 2 {
            let x = dx * (ix + 1);
            for y in y..y + h {
                let i = get_index(x, y, size.w);
                buffer[i] = TICK_COLOR;
            }
        }
    }

    /// Draw horizontal ticks across a vertical track.
    fn draw_ticks_vertical(num_bins: usize, size: Size, buffer: &mut [Vec4]) {
        let w = (size.w as f32 * TICK_D_FACTOR) as usize;
        let x = (size.w as f32 * TICK_OFFSET_FACTOR) as usize;
        let dy = size.h / (num_bins - 1);
        // A horizontal tick marker.
        let tick = vec![TICK_COLOR; w];
        for iy in 0..num_bins - 2 {
            let y = dy * (iy + 1);
            let i = x + y * size.w;
            // Copy the tick marker.
            buffer[i..i + w].copy_from_slice(&tick);
        }
    }
}

const fn get_index(x: usize, y: usize, w: usize) -> usize {
    x + y * w
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_slider() {
        let mut board = Board::new([255, 255, 255]);
        let mut slider_card = nodekit_rs_models::card::Slider {
            num_bins: 6,
            bin: 0,
            show_bin_markers: true,
            orientation: SliderOrientation::Horizontal,
            committed: false,
        };
        let mut region = Region {
            x: 0,
            y: 300,
            w: 700,
            h: 90,
            z_index: None,
        };
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // Committed, one tick.
        slider_card.committed = true;
        slider_card.bin = 1;
        region.y = 200;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // Final tick.
        slider_card.bin = 5;
        region.y = 100;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // Vertical.
        slider_card.orientation = SliderOrientation::Vertical;
        slider_card.bin = 0;
        slider_card.committed = false;
        region.x = -400;
        region.y = -100;
        region.w = 90;
        region.h = 300;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // Committed, one tick.
        slider_card.committed = true;
        slider_card.bin = 1;
        region.x = -200;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // Final tick.
        slider_card.bin = 5;
        region.x = 0;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        // One bin.
        slider_card.num_bins = 2;
        slider_card.bin = 0;
        region.x = 200;
        let slider = Slider::new(&region, &slider_card).unwrap().unwrap();
        slider.blit(&mut board);

        nodekit_rs_png::board_to_png("0.png", board.render_without_pointer());
    }
}
