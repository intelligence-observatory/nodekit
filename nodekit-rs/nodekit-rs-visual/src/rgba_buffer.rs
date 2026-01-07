use crate::{BOARD_SIZE, Error, STRIDE, resize};
use blittle::overlay::{
    Vec4, overlay_pixel, rgba8_to_rgba32, rgba8_to_rgba32_color, rgba32_to_rgb8,
};
use blittle::{ClippedRect, Size};
use fast_image_resize::PixelType;
use nodekit_rs_board_constants::*;
use nodekit_rs_models::Region;

pub struct RgbaBuffer {
    pub buffer: Vec<Vec4>,
    pub rect: ClippedRect,
}

impl RgbaBuffer {
    pub fn new(rect: ClippedRect, color: RgbaColor) -> Self {
        let color = rgba8_to_rgba32_color(&color);
        let buffer = vec![color; rect.src_size.w * rect.src_size.h];
        Self { buffer, rect }
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut [u8],
        bitmap_size: Size,
        region: &Region,
    ) -> Result<Option<Self>, Error> {
        let (buffer, rect) = resize(buffer, bitmap_size, region, PixelType::U8x4)?;
        let buffer = rgba8_to_rgba32(&buffer);
        Ok(
            ClippedRect::new(rect.position, BOARD_SIZE, rect.size)
                .map(|rect| Self { buffer, rect }),
        )
    }

    pub fn overlay_pixel_rgba(&mut self, src: &RgbaColor, dst_index: usize) {
        if dst_index < self.buffer.len() {
            overlay_pixel(&rgba8_to_rgba32_color(src), &mut self.buffer[dst_index]);
        }
    }

    pub fn get_rgba8_buffer(&self) -> Vec<u8> {
        rgba32_to_rgb8(&self.buffer)
    }

    /// Overlay a `src` pixel onto a `dst` pixel.
    pub(crate) const fn overlay_pixel_rgb(src: &RgbaColor, dst: &mut [u8; STRIDE]) {
        // If `src` is totally opaque, then just copy it over.
        if src[3] == 255 {
            dst[0] = src[0];
            dst[1] = src[1];
            dst[2] = src[2];
        } else {
            let src_alpha = src[3] as f64 / 255.;
            // https://github.com/aiueo13/image-overlay/blob/master/src/blend/fns.rs
            let one_minus_src_a = 1. - src_alpha;
            let alpha_final = src_alpha + one_minus_src_a;
            if alpha_final > 0. {
                dst[0] = Self::overlay_c(src[0], dst[0], src_alpha, one_minus_src_a, alpha_final);
                dst[1] = Self::overlay_c(src[1], dst[1], src_alpha, one_minus_src_a, alpha_final);
                dst[2] = Self::overlay_c(src[2], dst[2], src_alpha, one_minus_src_a, alpha_final);
            }
        }
    }

    /// Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors
    const fn overlay_c(
        src: u8,
        dst: u8,
        src_alpha: f64,
        one_minus_src_a: f64,
        alpha_final: f64,
    ) -> u8 {
        ((((src as f64 / 255.) * src_alpha + (dst as f64 / 255.) * one_minus_src_a) / alpha_final)
            * 255.) as u8
    }
}
