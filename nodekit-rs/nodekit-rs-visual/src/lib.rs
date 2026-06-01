//! Create and modify raw bitmaps.
//!
//! In nodekit-rs, there are two types of bitmaps:
//!
//! - An [`RgbBuffer`], a bitmap with RGB8 values that can be blitted onto the board.
//! - An [`RgbaBuffer`], a bitmap with RGBA32 values that can be overlaid onto the board.

mod board;
mod error;
mod pointer;
mod rgb_buffer;
mod rgba_buffer;
mod rounded_corners;
mod unclipped_rect;
mod visual_buffer;

use blittle::Size;
pub use board::*;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use hex_color::HexColor;
use nodekit_rs_models::Region;
use nodekit_rs_models::board::*;
use pointer::Pointer;
pub use rgb_buffer::RgbBuffer;
pub use rgba_buffer::RgbaBuffer;
pub use rounded_corners::Corner;
pub use unclipped_rect::UnclippedRect;
pub use visual_buffer::*;

/// Convert a hex string e.g. `"#FF0000FF"` to an RGB24 color.
pub fn parse_color_rgb(color: &str) -> Result<RgbColor, Error> {
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
pub fn parse_color_rgba(color: &str) -> Result<RgbaColor, Error> {
    let color = HexColor::parse_rgba(color).map_err(|e| Error::HexColor(color.to_string(), e))?;
    Ok(color.to_be_bytes())
}

fn resize(
    buffer: &mut [u8],
    size: Size,
    region: &Region,
    pixel_type: PixelType,
) -> Result<(Vec<u8>, UnclippedRect), Error> {
    // Resize to fit within `dst_size`.
    let (rect, resized) = get_resized_rect(size, region);

    if !resized {
        // No need to resize.
        Ok((buffer.to_vec(), rect))
    } else {
        // Resize the image.
        let src = fast_image_resize::images::ImageRef::new(
            size.w as u32,
            size.h as u32,
            buffer,
            pixel_type,
        )
        .map_err(Error::ImageResizeBuffer)?;
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

pub const fn get_resized_rect(size: Size, region: &Region) -> (UnclippedRect, bool) {
    // Resize to fit within `dst_size`.
    let mut rect = UnclippedRect::new(region);

    if rect.size.w == size.w && rect.size.h == size.h {
        (rect, false)
    } else {
        let card_size = rect.size;
        rect.size = size;
        // Resize to fit within the card.
        rect.resize(&card_size);
        // Shift the position.
        rect.position = Region::position(
            region.x,
            region.y,
            rect.size.w.cast_signed(),
            rect.size.h.cast_signed(),
        );
        (rect, true)
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
