mod rgba_range;
mod rect;

use blittle::stride::RGBA;
use bytemuck::{cast_slice, cast_slice_mut};
use fast_image_resize::PixelType;
use nodekit_rs_models::Rect;
use rgba_range::*;
pub use rect::RgbaRects;
use crate::{resize, Error, STRIDE};

pub struct RgbaBuffer {
    pub buffer: Vec<u8>,
    pub rects: RgbaRects,
}

impl RgbaBuffer {
    pub fn blit(&self, dst: &mut [u8]) {
        // Overlay.
        let src = cast_slice::<u8, [u8; RGBA]>(&self.buffer);
        let dst = cast_slice_mut::<u8, [u8; STRIDE]>(dst);

        let src_w = self.rects.src.xy1.x - self.rects.src.xy0.x;
        let dst_w = self.rects.dst.xy1.x - self.rects.dst.xy0.x;
        (self.rects.src.xy0.y..self.rects.src.xy1.y).zip(self.rects.dst.xy0.y..self.rects.dst.xy1.y).for_each(|(src_y, dst_y)| {
            (self.rects.src.xy0.x..self.rects.src.xy1.x).zip(self.rects.dst.xy0.x..self.rects.dst.xy1.x).for_each(|(src_x, dst_x)| {
                let src_index = Self::get_index(src_x, src_y, src_w);
                let dst_index = Self::get_index(dst_x, dst_y + src_y, dst_w);
                Self::overlay_pixel(&src[src_index], &mut dst[dst_index]);
            });
        });
    }
    
    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut Vec<u8>,
        src_width: u32,
        src_height: u32,
        dst: Rect,
    ) -> Result<Self, Error> {
        let (buffer, rect) = resize(buffer, src_width, src_height, dst, PixelType::U8x4)?;
        let rects = RgbaRects::new(&rect).ok_or(Error::InvalidRgbaRects(dst))?;
        Ok(Self { buffer, rects })
    }

    const fn get_index(x: usize, y: usize, w: usize) -> usize {
        x + y * w
    }

    /// Overlay a `src` pixel onto a `dst` pixel.
    pub const fn overlay_pixel(src: &[u8; RGBA], dst: &mut [u8; STRIDE]) {
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
    pub const fn overlay_c(
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

#[cfg(test)]
mod tests {
    use std::fs::File;
    use std::io::BufWriter;
    use blittle::PositionU;
    use png::ColorType;
    use nodekit_rs_models::{Position, Size};
    use crate::{board, BOARD_D, BOARD_D_U32};
    use crate::rgba::rect::RgbaRect;
    use super::*;

    #[test]
    fn test_overlay_pixel() {
        let mut dst = [255, 255, 255];
        let mut src = [0, 0, 0, 255];
        RgbaBuffer::overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [0, 0, 0]);

        dst = [200, 170, 30];
        src = [100, 200, 120, 255];
        RgbaBuffer::overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [100, 200, 120]);

        dst = [0, 255, 255];
        src = [255, 0, 0, 255];
        RgbaBuffer::overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [255, 0, 0]);

        dst = [200, 170, 30];
        src = [100, 200, 120, 50];
        RgbaBuffer::overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [180, 175, 47]);
    }

    #[test]
    fn test_rgba_buffer_blit() {
        let mut board = board([255, 0, 255]);
        let mut src = get_rgba_buffer();
        // Semi-transparent.
        cast_slice_mut::<u8, [u8; 4]>(&mut src).iter_mut().for_each(|pixel| {
            pixel[3] = 200;
        });
        let src_w = 300;
        let src_h = 600;
        let visual = RgbaBuffer {
            buffer: src,
            rects: RgbaRects {
                src: RgbaRect {
                    xy0: PositionU {
                        x: 0,
                        y: 0
                    },
                    xy1: PositionU {
                        x: src_w,
                        y: src_h
                    }
                },
                dst: RgbaRect {
                    xy0: PositionU {
                        x: 0,
                        y: 0
                    },
                    xy1: PositionU {
                        x: BOARD_D / 2,
                        y: BOARD_D
                    }
                }
            }
        };
        visual.blit(&mut board);
        encode(
            "rgba_blit.png",
            &board,
            BOARD_D_U32,
            BOARD_D_U32,
            ColorType::Rgb
        );
    }

    #[test]
    fn test_rgba_buffer_resize() {
        let resized = RgbaBuffer::new_resized(
            &mut get_rgba_buffer(),
            300,
            600,
            Rect {
                position: Position { x: -0.5, y: -0.5 },
                size: Size { w: 1., h: 1. },
            },
        )
            .unwrap();
        assert_eq!(resized.rects.dst.xy0.x, 192);
        assert_eq!(resized.rects.dst.xy0.y, 0);
        encode("rgba_resized.png", &resized.buffer, BOARD_D_U32 / 2, BOARD_D_U32, ColorType::Rgba);
    }

    fn encode(filename: &str, buffer: &[u8], width: u32, height: u32, color_type: ColorType) {
        let file = File::create(filename).unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder =
            png::Encoder::new(w, width, height);
        encoder.set_color(color_type);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(buffer).unwrap();
    }

    fn get_rgba_buffer() -> Vec<u8> {
        include_bytes!("../test_files/rgba.raw").to_vec()
    }
}
