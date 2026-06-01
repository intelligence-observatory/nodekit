mod slider_rects;
mod thumb;
mod thumb_color;

use blittle::overlay::Vec4;
use blittle::{ClippedRect, Size};
use nodekit_rs_models::Region;
use nodekit_rs_models::card::SliderOrientation;
use nodekit_rs_visual::{Board, Corner, RgbaBuffer};
use slider_rects::SliderRects;
use thumb::Thumb;

const TICK_COLOR: Vec4 = Vec4::new(182. / 255., 183. / 255., 184. / 255., 1.);
const TRACK_COLOR: Vec4 = Vec4::new(214. / 255., 216. / 255., 219. / 255., 1.);
/// The scaling factor of a tick marker.
const TICK_D_FACTOR: f32 = 0.7;
/// The positional offset factor of a tick marker.
const TICK_OFFSET_FACTOR: f32 = 0.15;

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
    pub fn new(region: &Region, slider: &nodekit_rs_models::card::Slider) -> Option<Self> {
        let (track, rect) = Self::get_track(region, slider)?;
        let thumb = Thumb::new(region, slider.num_bins, &slider.orientation);
        Some(Self {
            track,
            thumb,
            rect,
            bin: slider.bin,
            committed: slider.committed,
        })
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
    ) -> Option<(RgbaBuffer, ClippedRect)> {
        let rects = SliderRects::new(region, slider)?;
        // Get the raw track buffer, filled in with the color.
        let mut track = vec![TRACK_COLOR; rects.track.src_size.w * rects.track.src_size.h];
        // Set its corners.
        Corner::TopLeft.round_corner(rects.track.src_size, &mut track);
        Corner::TopRight.round_corner(rects.track.src_size, &mut track);
        Corner::BottomRight.round_corner(rects.track.src_size, &mut track);
        Corner::BottomLeft.round_corner(rects.track.src_size, &mut track);
        // Draw tick markers.
        if slider.show_bin_markers {
            Self::draw_ticks(slider, rects.track.src_size, &mut track);
        }

        Some((
            RgbaBuffer {
                buffer: track,
                rect: rects.track,
            },
            rects.total,
        ))
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
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // Committed, one tick.
        slider_card.committed = true;
        slider_card.bin = 1;
        region.y = 200;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // Final tick.
        slider_card.bin = 5;
        region.y = 100;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // Vertical.
        slider_card.orientation = SliderOrientation::Vertical;
        slider_card.bin = 0;
        slider_card.committed = false;
        region.x = -400;
        region.y = -100;
        region.w = 90;
        region.h = 300;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // Committed, one tick.
        slider_card.committed = true;
        slider_card.bin = 1;
        region.x = -200;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // Final tick.
        slider_card.bin = 5;
        region.x = 0;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        // One bin.
        slider_card.num_bins = 2;
        slider_card.bin = 0;
        region.x = 200;
        let slider = Slider::new(&region, &slider_card).unwrap();
        slider.blit(&mut board);

        board.hide_pointer = true;

        nodekit_rs_png::board_to_png("0.png", board.render());
    }
}
