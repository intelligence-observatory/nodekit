//! Visual buffer functionality that is shared by images, text, and video.

mod blit_rect;
mod board;
mod error;
mod overlay;

pub use blit_rect::*;
use blittle::*;
pub use board::*;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use hex_color::HexColor;
use nodekit_rs_models::Rect;
pub use overlay::*;

/// Convert a hex string e.g. `"#FF0000FF"` to bytes.
pub fn parse_color(color: &str) -> Result<[u8; STRIDE], Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    Ok(color.to_be_bytes())
}

/// A raw RGB32 bitmap and its pixel size.
pub struct VisualBuffer {
    /// A raw RGB24 bitmap.
    pub buffer: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

impl VisualBuffer {
    /// Resize to fit within the bounds of the rect.
    /// Then, blit my buffer onto the board.
    pub fn blit(&mut self, rect: Rect, board: &mut [u8]) -> Result<(), Error> {
        let (rect, len) = self.resize_to_fit(rect)?;
        let blit_rect = BlitRect::from(rect);
        blit(
            &self.buffer[0..len],
            &blit_rect.size,
            board,
            &blit_rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
        Ok(())
    }

    /// Resize to fit within the bounds of `(width, height)`.
    fn resize_to_fit(&mut self, mut rect: Rect) -> Result<(Rect, usize), Error> {
        // Constrain to the bounds.
        let (width, height) = if rect.size.w < rect.size.h {
            (rect.size.w, rect.size.h)
        } else if rect.size.w < rect.size.h {
            (rect.size.w, rect.size.w * rect.size.w / rect.size.h)
        } else {
            (rect.size.h, rect.size.h * rect.size.h / rect.size.w)
        };
        // Convert to pixel units.
        let dst_w = size_coordinate(width);
        let dst_h = size_coordinate(height);

        // Create an image view.
        let src = fast_image_resize::images::Image::from_slice_u8(
            self.width,
            self.height,
            &mut self.buffer,
            PixelType::U8x4,
        )
        .map_err(Error::ImageResizeBuffer)?;

        // Resize the image.
        let mut dst =
            fast_image_resize::images::Image::new(dst_w as u32, dst_h as u32, PixelType::U8x4);
        let options = ResizeOptions {
            algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
            cropping: SrcCropping::None,
            mul_div_alpha: false,
        };
        let mut resizer = Resizer::new();
        resizer
            .resize(&src, &mut dst, Some(&options))
            .map_err(Error::ImageResize)?;

        // Offset the position.
        if width < rect.size.w {
            rect.position.x += rect.size.w / 2. - width / 2.;
        }
        if height < rect.size.h {
            rect.position.y += rect.size.h / 2. - height / 2.;
        }
        // Set the size.
        rect.size.w = width;
        rect.size.h = height;

        // Set the new buffer.
        let dst_buffer = dst.buffer();
        let dst_len = dst_buffer.len();
        if dst_len > self.buffer.len() {
            self.buffer.resize(dst_len, 0);
        }
        self.buffer[0..dst_len].copy_from_slice(dst_buffer);
        Ok((rect, dst_len))
    }
}
