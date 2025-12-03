use blittle::overlay::{overlay_pixel, rgba8_to_rgba32, rgba8_to_rgba32_color, Vec4};
use blittle::stride::RGBA;
use fast_image_resize::PixelType;
use crate::rect::Rect;
use crate::{resize, Error, STRIDE};

pub struct RgbaBuffer {
    pub(crate) buffer: Vec<Vec4>,
    pub rect: Rect
}

impl RgbaBuffer {
    pub fn new_rgba(rect: Rect, color: [u8; RGBA]) -> Self {
        let color = rgba8_to_rgba32_color(&color);
        let buffer = vec![color; rect.size.w * rect.size.h];
        Self {
            buffer,
            rect
        }
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut [u8],
        src_width: u32,
        src_height: u32,
        dst: nodekit_rs_models::Rect,
    ) -> Result<Self, Error> {
        let (buffer, rect) = resize(buffer, src_width, src_height, &dst, PixelType::U8x3)?;
        let rect = Rect::from(rect);
        let buffer = rgba8_to_rgba32(&buffer);
        Ok(Self { buffer, rect })
    }
    
    pub fn overlay_pixel_rgba(&mut self, src: &[u8; RGBA], dst_index: usize) {
        overlay_pixel(&rgba8_to_rgba32_color(src), &mut self.buffer[dst_index]);
    }

    /// Overlay a `src` pixel onto a `dst` pixel.
    pub(crate) const fn overlay_pixel_rgb(src: &[u8; RGBA], dst: &mut [u8; STRIDE]) {
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