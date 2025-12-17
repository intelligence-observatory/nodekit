//! Visual buffer functionality that is shared by images, text, and video.

mod board;
mod cursor;
mod error;
mod rgb_buffer;
mod rgba_buffer;
mod unclipped_rect;
mod visual_buffer;
mod borrowed_rgba_buffer;

use blittle::Size;
use blittle::stride::RGBA;
pub use borrowed_rgba_buffer::*;
pub use board::*;
pub use cursor::Cursor;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use hex_color::HexColor;
use nodekit_rs_models::Region;
pub use rgb_buffer::RgbBuffer;
pub use rgba_buffer::RgbaBuffer;
pub use unclipped_rect::UnclippedRect;
pub use visual_buffer::*;

pub const fn to_blittle_size(region: &Region) -> Size {
    Size {
        w: size_coordinate(region.w),
        h: size_coordinate(region.h),
    }
}

/// Convert a hex string e.g. `"#FF0000FF"` to an RGB24 color.
pub fn parse_color_rgb(color: &str) -> Result<[u8; STRIDE], Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    if color.a == 255 {
        Ok([color.r, color.g, color.b])
    } else {
        // Overlay onto white.
        let mut dst = [255, 255, 255];
        RgbaBuffer::overlay_pixel_rgb(&color.to_be_bytes(), &mut dst);
        Ok(dst)
    }
}

/// Convert a hex string e.g. `"#FF0000FF"` to an RGB32 color.
pub fn parse_color_rgba(color: &str) -> Result<[u8; RGBA], Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    Ok(color.to_be_bytes())
}

fn resize(
    buffer: &mut [u8],
    bitmap_size: Size,
    region: &Region,
    pixel_type: PixelType,
) -> Result<(Vec<u8>, UnclippedRect), Error> {
    // Resize to fit within `dst_size`.
    let mut rect = UnclippedRect::new(region);

    // No need to resize.
    if rect.size.w == bitmap_size.w && rect.size.h == bitmap_size.h {
        Ok((buffer.to_vec(), rect))
    } else {
        // Create an image view.
        let src = fast_image_resize::images::ImageRef::new(
            bitmap_size.w as u32,
            bitmap_size.h as u32,
            buffer,
            pixel_type,
        )
        .map_err(Error::ImageResizeBuffer)?;

        let card_size = rect.size;
        rect.size = bitmap_size;
        rect.resize(&card_size);

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
}
