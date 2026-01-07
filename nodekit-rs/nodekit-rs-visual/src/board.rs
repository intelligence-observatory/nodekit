//! Various constants used to describe the size of the visual board.

use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;
use crate::{BorrowedRgbaBuffer, VisualBuffer};
use blittle::overlay::*;
use blittle::*;
use bytemuck::cast_slice_mut;
use nodekit_rs_board_constants::*;

/// Create a bitmap and fill it with a color.
pub fn bitmap_rgb(width: usize, height: usize, color: RgbColor) -> Vec<u8> {
    let mut bitmap = vec![0; width * height * STRIDE];
    cast_slice_mut::<u8, RgbColor>(&mut bitmap).fill(color);
    bitmap
}

pub struct Board {
    board8_without_cursor: Vec<u8>,
    board8_final: Vec<u8>,
    /// An empty board used to clear the bitmap.
    board8_clear: Vec<u8>,
    board32: Vec<Vec4>,
    board32_zeros: Vec<Vec4>,
    dirty: bool,
    color: RgbColor,
}

impl Board {
    pub fn new(color: RgbColor) -> Self {
        // Create the boards.
        let board8 = bitmap_rgb(BOARD_D, BOARD_D, color);
        let board32 = rgb8_to_rgba32(&board8);
        let board32_zeros = vec![Vec4::default(); board32.len()];
        Self {
            board8_without_cursor: board8.clone(),
            board8_clear: board8.clone(),
            board8_final: board8,
            board32,
            board32_zeros,
            dirty: false,
            color,
        }
    }

    pub fn fill(&mut self, color: RgbColor) {
        self.color = color;
        cast_slice_mut::<u8, RgbColor>(&mut self.board8_clear).fill(color);
        self.clear();
    }

    pub fn clear(&mut self) {
        self.board8_without_cursor
            .copy_from_slice(&self.board8_clear);
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
            &mut self.board8_without_cursor,
            &buffer.rect,
            &PIXEL_TYPE,
        );
    }

    pub fn overlay_rgba(&mut self, buffer: &RgbaBuffer) {
        // Mark as dirty.
        if !self.dirty {
            self.dirty = true;
            // Convert RGB8 data into RGBA32 data.
            rgb8_to_rgba32_in_place(&self.board8_without_cursor, &mut self.board32);
        }
        // Overlay.
        overlay_rgba32(&buffer.buffer, &mut self.board32, &buffer.rect);
    }

    pub fn overlay_borrowed_rgba(&mut self, buffer: &BorrowedRgbaBuffer<'_>) {
        // Mark as dirty.
        if !self.dirty {
            self.dirty = true;
            // Convert RGB8 data into RGBA32 data.
            rgb8_to_rgba32_in_place(&self.board8_without_cursor, &mut self.board32);
        }
        // Overlay.
        overlay_rgba32(buffer.buffer, &mut self.board32, &buffer.rect);
    }

    pub fn blit_cursor(&mut self, buffer: &[Vec4], rect: &Option<ClippedRect>) -> &[u8] {
        // Apply remaining overlays.
        self.apply_overlays();

        // Overlay cursor.
        if let Some(rect) = rect {
            // Copy to the final board.
            self.board8_final
                .copy_from_slice(&self.board8_without_cursor);
            // Overlay the cursor.
            let dst = cast_slice_mut::<u8, [u8; STRIDE]>(&mut self.board8_final);
            (0..rect.src_size_clipped.h).for_each(|src_y| {
                let src_index = Self::get_index32(0, src_y, rect.src_size.w);
                let dst_index = Self::get_index32(
                    rect.dst_position_clipped.x,
                    rect.dst_position_clipped.y + src_y,
                    rect.dst_size.w,
                );
                buffer[src_index..src_index + rect.src_size_clipped.w]
                    .iter()
                    .zip(dst[dst_index..dst_index + rect.src_size_clipped.w].iter_mut())
                    .for_each(|(src, dst)| {
                        Self::overlay_pixel_rgb(src, dst);
                    });
            });
        }
        &self.board8_final
    }

    pub fn get_board_without_cursor(&mut self) -> &[u8] {
        // Apply remaining overlays.
        self.apply_overlays();
        &self.board8_without_cursor
    }

    fn apply_overlays(&mut self) {
        if self.dirty {
            // Apply overlays.
            rgba32_to_rgb8_in_place(&self.board32, &mut self.board8_without_cursor);
            // Clear overlays.
            self.board32.copy_from_slice(&self.board32_zeros);
            // Clean.
            self.dirty = false;
        }
    }

    /// Overlay a `src` pixel onto a `dst` pixel.
    fn overlay_pixel_rgb(src: &Vec4, dst: &mut [u8; STRIDE]) {
        // https://github.com/aiueo13/image-overlay/blob/master/src/blend/fns.rs
        let one_minus_src_a = 1. - src.w;
        let alpha_final = src.w + one_minus_src_a;
        if alpha_final > 0. {
            dst[0] = Self::overlay_c(src.x, dst[0], src.w, one_minus_src_a, alpha_final);
            dst[1] = Self::overlay_c(src.y, dst[1], src.w, one_minus_src_a, alpha_final);
            dst[2] = Self::overlay_c(src.z, dst[2], src.w, one_minus_src_a, alpha_final);
        }
    }

    /// Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors
    const fn overlay_c(
        src: f32,
        dst: u8,
        src_alpha: f32,
        one_minus_src_a: f32,
        alpha_final: f32,
    ) -> u8 {
        (((src * src_alpha + (dst as f32 / 255.) * one_minus_src_a) / alpha_final) * 255.) as u8
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
    use crate::Cursor;

    #[test]
    fn test_blit_cursor() {
        let mut board = Board::new([200, 200, 200]);
        let cursor = Cursor::default();
        nodekit_rs_png::board_to_png(
            "cursor.png",
            &board.blit_cursor(&cursor.0, &Cursor::rect(BOARD_D_I64_HALF, BOARD_D_I64_HALF)),
        );
    }
}
