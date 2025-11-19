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
        mut buffer: Vec<u8>,
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
            &mut buffer,
            PixelType::U8x4,
        )
        .map_err(Error::ImageResizeBuffer)?;

        // Resize the image.
        let width = rect.size.w as u32;
        let height = rect.size.h as u32;
        let mut dst = fast_image_resize::images::Image::new(width, height, PixelType::U8x4);
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
