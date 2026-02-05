use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;
use crate::{Pointer, VisualBuffer, overlay_c};
use blittle::overlay::*;
use blittle::*;
use bytemuck::cast_slice_mut;
use nodekit_rs_models::board::*;

/// Create a bitmap and fill it with a color.
pub fn bitmap_rgb(width: usize, height: usize, color: RgbColor) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * STRIDE];
    cast_slice_mut::<u8, RgbColor>(&mut bitmap).fill(color);
    bitmap
}

/// Bitmaps used to render to the board.
pub struct Board {
    /// Render all cards to this bitmap.
    board_without_pointer: Vec<u8>,
    /// The final bitmap: `board8_without_pointer` + `board32` overlays + the pointer.
    board_final: Vec<u8>,
    /// This is used to erase the board.
    board_empty: Vec<u8>,
    /// This is used to apply overlays.
    overlay: Vec<Vec4>,
    /// If true, the board has been updated.
    dirty: bool,
    /// The background color.
    color: RgbColor,
    /// The pointer.
    pointer: Pointer,
    /// If true, hide the pointer.
    pub hide_pointer: bool,
}

impl Board {
    pub fn new(color: RgbColor) -> Self {
        // Create the boards.
        let board = bitmap_rgb(HORIZONTAL.u_size, VERTICAL.u_size, color);
        let overlay = rgb8_to_rgba32(&board);
        Self {
            board_without_pointer: board.clone(),
            board_empty: board.clone(),
            board_final: board,
            overlay,
            dirty: false,
            color,
            pointer: Pointer::default(),
            hide_pointer: false,
        }
    }

    pub fn fill(&mut self, color: RgbColor) {
        self.color = color;
        self.clear();
    }

    pub fn clear(&mut self) {
        cast_slice_mut::<u8, RgbColor>(&mut self.board_without_pointer).fill(self.color);
        self.board_empty
            .copy_from_slice(&self.board_without_pointer);
    }

    pub fn blit(&mut self, buffer: &VisualBuffer) {
        match buffer {
            VisualBuffer::Rgb(buffer) => self.blit_rgb(buffer),
            VisualBuffer::Rgba(buffer) => self.overlay_rgba(buffer),
        }
    }

    /// Blit RGB8 onto the board.
    pub fn blit_rgb(&mut self, buffer: &RgbBuffer) {
        // Apply the overlays.
        self.apply_overlays();
        // Then blit on top of them.
        blit(
            &buffer.buffer,
            &mut self.board_without_pointer,
            &buffer.rect,
            &PIXEL_TYPE,
        );
    }

    pub fn overlay_rgba(&mut self, buffer: &RgbaBuffer) {
        self.overlay_rgba_raw(&buffer.buffer, &buffer.rect);
    }

    /// Render an RgbaBuffer without actually needing to create one.
    /// This is useful if you don't want to move `buffer`.
    pub fn overlay_rgba_raw(&mut self, buffer: &[Vec4], rect: &ClippedRect) {
        // Mark as dirty.
        if !self.dirty {
            self.dirty = true;
            // Convert RGB8 data into RGBA32 data.
            rgb8_to_rgba32_in_place(&self.board_without_pointer, &mut self.overlay);
        }
        // Overlay.
        overlay_rgba32(buffer, &mut self.overlay, rect);
    }

    pub fn set_pointer(&mut self, x: i64, y: i64) {
        self.pointer.set_rect(x, y);
    }

    pub fn render(&mut self) -> &[u8] {
        // Apply remaining overlays.
        self.apply_overlays();

        // Overlay pointer.
        if !self.hide_pointer
            && let Some(rect) = self.pointer.rect.as_ref()
        {
            // Copy to the final board.
            self.board_final
                .copy_from_slice(&self.board_without_pointer);
            // Draw the pointer.
            let dst = cast_slice_mut::<u8, [u8; STRIDE]>(&mut self.board_final);
            (0..rect.src_size_clipped.h).for_each(|src_y| {
                let src_index = Self::get_index32(0, src_y, rect.src_size.w);
                let dst_index = Self::get_index32(
                    rect.dst_position_clipped.x,
                    rect.dst_position_clipped.y + src_y,
                    rect.dst_size.w,
                );
                self.pointer.buffer[src_index..src_index + rect.src_size_clipped.w]
                    .iter()
                    .zip(dst[dst_index..dst_index + rect.src_size_clipped.w].iter_mut())
                    .for_each(|(src, dst)| {
                        Self::overlay_pixel_rgb(src, dst);
                    });
            });
            &self.board_final
        } else {
            &self.board_without_pointer
        }
    }

    pub fn erase(&mut self, rect: &ClippedRect) {
        blit(
            &self.board_empty,
            &mut self.board_without_pointer,
            rect,
            &PIXEL_TYPE,
        );
    }

    fn apply_overlays(&mut self) {
        if self.dirty {
            // Apply overlays.
            rgba32_to_rgb8_in_place(&self.overlay, &mut self.board_without_pointer);
            // Clear overlays.
            self.overlay.fill(Vec4::ZERO);
            // Clean.
            self.dirty = false;
        }
    }

    /// Overlay a `src` pixel onto a `dst` pixel.
    const fn overlay_pixel_rgb(src: &Vec4, dst: &mut [u8; STRIDE]) {
        // This lets the function be constant.
        let src = src.to_array();
        // https://github.com/aiueo13/image-overlay/blob/master/src/blend/fns.rs
        let one_minus_src_a = 1. - src[3];
        let alpha_final = src[3] + one_minus_src_a;
        if alpha_final > 0. {
            dst[0] = overlay_c(src[0], dst[0], src[3], one_minus_src_a, alpha_final);
            dst[1] = overlay_c(src[1], dst[1], src[3], one_minus_src_a, alpha_final);
            dst[2] = overlay_c(src[2], dst[2], src[3], one_minus_src_a, alpha_final);
        }
    }

    const fn get_index32(x: usize, y: usize, w: usize) -> usize {
        x + y * w
    }
}

impl Default for Board {
    fn default() -> Self {
        Self::new([0, 0, 0])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_render_pointer() {
        let mut board = Board::new([200, 200, 200]);
        nodekit_rs_png::board_to_png("pointer.png", &board.render());
    }
}
