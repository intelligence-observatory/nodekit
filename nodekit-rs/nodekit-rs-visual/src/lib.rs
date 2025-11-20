//! Visual buffer functionality that is shared by images, text, and video.

mod blit_rect;
mod board;
mod error;
mod overlay;
mod resized_rect;

pub use blit_rect::*;
pub use board::*;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use hex_color::HexColor;
use nodekit_rs_models::Rect;
pub use overlay::*;
use resized_rect::ResizedRect;

/// Convert a hex string e.g. `"#FF0000FF"` to bytes.
pub fn parse_color(color: &str) -> Result<[u8; STRIDE], Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    if color.a == 255 {
        Ok([color.r, color.g, color.b])
    } else {
        // Overlay onto white.
        let mut dst = [255, 255, 255];
        overlay_pixel(&color.to_be_bytes(), &mut dst);
        Ok(dst)
    }
}

/// A raw RGB32 bitmap and its pixel size.
pub struct VisualBuffer {
    /// A raw RGB32 bitmap.
    pub buffer: Vec<u8>,
    pub rect: BlitRect,
}

impl VisualBuffer {
    pub fn blit(&self, board: &mut [u8]) {
        blittle::blit(
            &self.buffer,
            &self.rect.size,
            board,
            &self.rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
    }

    /// Resize to fit within the bounds of `dst`.
    pub fn new_resized(
        buffer: &mut Vec<u8>,
        src_width: u32,
        src_height: u32,
        dst: Rect,
    ) -> Result<Self, Error> {
        // Resize to fit within `dst_size`.
        let rect = ResizedRect::new(&dst, src_width, src_height);
        // Create an image view.
        let src = fast_image_resize::images::Image::from_slice_u8(
            src_width,
            src_height,
            buffer,
            PixelType::U8x3,
        )
        .map_err(Error::ImageResizeBuffer)?;

        // Resize the image.
        let width = rect.size.w as u32;
        let height = rect.size.h as u32;
        let mut dst = fast_image_resize::images::Image::new(width, height, PixelType::U8x3);
        let options = ResizeOptions {
            algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
            cropping: SrcCropping::None,
            mul_div_alpha: false,
        };
        let mut resizer = Resizer::new();
        resizer
            .resize(&src, &mut dst, Some(&options))
            .map_err(Error::ImageResize)?;
        // Set the new buffer.
        let buffer = dst.buffer().to_vec();
        let rect = BlitRect::from(rect);
        Ok(Self { buffer, rect })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use blittle::PositionU;
    use bytemuck::cast_slice;
    use nodekit_rs_models::{Position, Size};
    use png::ColorType;
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_visual_buffer() {
        let buffer = include_bytes!("../test_image.raw").to_vec();
        encode(
            "test.png",
            &VisualBuffer {
                buffer,
                rect: BlitRect {
                    position: PositionU::default(),
                    size: blittle::Size { w: 300, h: 600 },
                },
            },
            ColorType::Rgba,
        );
    }

    #[test]
    fn test_visual_buffer_blit() {
        let mut board = board([255, 0, 255]);

        let visual = VisualBuffer {
            buffer: get_rgb_buffer(),
            rect: BlitRect {
                position: PositionU::default(),
                size: blittle::Size { w: 300, h: 600 },
            },
        };
        visual.blit(&mut board);
        encode(
            "blitted.png",
            &VisualBuffer {
                buffer: board,
                rect: BlitRect {
                    position: PositionU::default(),
                    size: blittle::Size {
                        w: BOARD_D,
                        h: BOARD_D,
                    },
                },
            },
            ColorType::Rgb,
        );
    }

    #[test]
    fn test_image_resize() {
        let resized = VisualBuffer::new_resized(
            &mut get_rgb_buffer(),
            300,
            600,
            Rect {
                position: Position { x: -0.5, y: -0.5 },
                size: Size { w: 1., h: 1. },
            },
        )
        .unwrap();
        assert_eq!(resized.rect.position.x, 192);
        assert_eq!(resized.rect.position.y, 0);
        assert_eq!(resized.rect.size.w, 384);
        assert_eq!(resized.rect.size.h, 768);
        encode("resized.png", &resized, ColorType::Rgb);
    }

    fn encode(filename: &str, visual: &VisualBuffer, color_type: ColorType) {
        let file = File::create(filename).unwrap();
        let ref mut w = BufWriter::new(file);
        let mut encoder =
            png::Encoder::new(w, visual.rect.size.w as u32, visual.rect.size.h as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(color_type);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer.write_image_data(&visual.buffer).unwrap();
    }

    fn get_rgb_buffer() -> Vec<u8> {
        cast_slice::<u8, [u8; 4]>(include_bytes!("../test_image.raw"))
            .into_iter()
            .map(|pixel| [pixel[0], pixel[1], pixel[2]])
            .flatten()
            .collect::<Vec<u8>>()
    }
}
