//! Visual buffer functionality that is shared by images, text, and video.

mod board;
mod error;
mod resized_rect;
mod rgb;
mod rgba;
mod visual_buffer;

use blittle::Size;
pub use board::*;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use hex_color::HexColor;
use nodekit_rs_models::Rect;
pub use resized_rect::ResizedRect;
pub use rgb::*;
pub use rgba::*;
pub use visual_buffer::*;

pub const fn to_blittle_size(size: &nodekit_rs_models::Size) -> Size {
    Size {
        w: size_coordinate(size.w),
        h: size_coordinate(size.h),
    }
}

/// Convert a hex string e.g. `"#FF0000FF"` to bytes.
pub fn parse_color(color: &str) -> Result<[u8; STRIDE], Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    if color.a == 255 {
        Ok([color.r, color.g, color.b])
    } else {
        // Overlay onto white.
        let mut dst = [255, 255, 255];
        RgbaBuffer::overlay_pixel(&color.to_be_bytes(), &mut dst);
        Ok(dst)
    }
}

fn resize(
    buffer: &mut Vec<u8>,
    src_width: u32,
    src_height: u32,
    dst: Rect,
    pixel_type: PixelType,
) -> Result<(Vec<u8>, ResizedRect), Error> {
    // Resize to fit within `dst_size`.
    let rect = ResizedRect::new(&dst, src_width, src_height);

    // No need to resize.
    if rect.size.w == src_width as usize && rect.size.h == src_height as usize {
        return Ok((buffer.clone(), rect));
    }

    // Create an image view.
    let src =
        fast_image_resize::images::Image::from_slice_u8(src_width, src_height, buffer, pixel_type)
            .map_err(Error::ImageResizeBuffer)?;

    // Resize the image.
    let width = rect.size.w as u32;
    let height = rect.size.h as u32;
    let mut dst = fast_image_resize::images::Image::new(width, height, pixel_type);
    let options = ResizeOptions {
        algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
        cropping: SrcCropping::None,
        mul_div_alpha: false,
    };
    let mut resizer = Resizer::new();
    resizer
        .resize(&src, &mut dst, Some(&options))
        .map_err(Error::ImageResize)?;
    Ok((dst.buffer().to_vec(), rect))
}
