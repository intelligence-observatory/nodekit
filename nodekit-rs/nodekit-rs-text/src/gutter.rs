use blittle::{ClippedRect, PositionI, Size};
use blittle::overlay::{overlay_rgba32, rgba8_to_rgba32_color, Vec4};
use nodekit_rs_models::board::{RgbaColor, BOARD_SIZE};
use nodekit_rs_visual::{Board, Corner, UnclippedRect};

const GUTTER_TEXT_SIZE: Size = Size { w: 33, h: 12 };

#[derive(Copy, Clone)]
pub enum GutterState {
    Disabled,
    Enabled,
    Hovering
}

pub struct Gutter {
    disabled: Vec<Vec4>,
    enabled: Vec<Vec4>,
    hovering: Vec<Vec4>,
    pub rect: ClippedRect,
    state: GutterState
}

impl Gutter {
    pub fn new(position: PositionI, width: usize, done_text: &[Vec4]) -> Option<Self> {
        let size = Size {
            w: width,
            h: 31
        };
        let rect = UnclippedRect { position, size};
        let rect = rect.into_clipped_rect(BOARD_SIZE)?;
        let disabled = Self::get_buffer([220, 220, 220, 255], size);
        let enabled = Self::get_done_buffer([235, 235, 235, 255], size, done_text)?;
        let hovering = Self::get_done_buffer([200, 200, 200, 255], size, done_text)?;
        Some(Self {
            disabled,
            enabled,
            hovering,
            rect,
            state: GutterState::Disabled
        })
    }

    pub const fn set_state(&mut self, state: GutterState) {
        self.state = state;
    }

    pub fn blit(&self, board: &mut Board) {
        let buffer = match &self.state {
            GutterState::Disabled => &self.disabled,
            GutterState::Enabled => &self.enabled,
            GutterState::Hovering => &self.hovering,
        };
        board.overlay_rgba_raw(buffer, &self.rect);
    }

    fn get_buffer(color: RgbaColor, size: Size) -> Vec<Vec4> {
        // Get the color.
        let color = rgba8_to_rgba32_color(&color);
        // Get the buffer.
        let mut buffer = vec![color; size.w * size.h];
        // The first row is transparent.
        buffer[0..size.w].fill(Vec4::ZERO);
        // Round the corners.
        Corner::BottomRight.round_corner(size, &mut buffer);
        Corner::BottomLeft.round_corner(size, &mut buffer);
        buffer
    }

    fn get_done_buffer(color: RgbaColor, size: Size, done: &[Vec4]) -> Option<Vec<Vec4>> {
        let mut buffer = Self::get_buffer(color, size);
        let rect = UnclippedRect {
            position: PositionI {
                x: (size.w / 2 - GUTTER_TEXT_SIZE.w / 2).cast_signed(),
                y: (size.h / 2 - GUTTER_TEXT_SIZE.h / 2).cast_signed(),
            },
            size: GUTTER_TEXT_SIZE
        };
        let rect = rect.into_clipped_rect(size)?;
        overlay_rgba32(done, &mut buffer, &rect);
        Some(buffer)
    }
}
