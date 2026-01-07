//! Convert .png files into raw RGB24 bitmaps.
//!
//! Image formats currently supported:
//! - RGB24
//! - RGBA32
//! - Grayscale
//! - Grayscale Alpha

mod error;

use blittle::Size;
use bytemuck::{cast_slice, cast_slice_mut};
pub use error::Error;
use nodekit_rs_asset::load_asset;
use nodekit_rs_models::{Asset, Region, board::*};
use nodekit_rs_visual::*;
use png::{ColorType, Decoder};

/// Load an image into memory.
/// Resize the image as needed.
pub fn load_image(asset: &Asset, region: &Region) -> Result<Option<VisualBuffer>, Error> {
    let decoder = Decoder::new(std::io::Cursor::new(
        load_asset(asset).map_err(Error::Asset)?,
    ));
    let mut reader = decoder
        .read_info()
        .map_err(|e| Error::Decode(e, asset.to_string()))?;
    let mut buffer = vec![
        0;
        reader
            .output_buffer_size()
            .ok_or(Error::BufferSize(asset.to_string()))?
    ];
    let info = reader
        .next_frame(&mut buffer)
        .map_err(|e| Error::Decode(e, asset.to_string()))?;
    let bitmap_size = Size {
        w: info.width as usize,
        h: info.height as usize,
    };
    match info.color_type {
        ColorType::Rgb => Ok(RgbBuffer::new_resized(&mut buffer, bitmap_size, region)
            .map_err(Error::Visual)?
            .map(VisualBuffer::Rgb)),
        ColorType::Rgba => {
            // There are often RGBA images in which the A channel is always 255...
            let opaque = cast_slice::<u8, [u8; 4]>(&buffer)
                .iter()
                .all(|pixel| pixel[3] == 255);
            // ...in which case, convert to RGB.
            if opaque {
                Ok(
                    RgbBuffer::new_resized(&mut rgba_to_rgb(&buffer), bitmap_size, region)
                        .map_err(Error::Visual)?
                        .map(VisualBuffer::Rgb),
                )
            } else {
                Ok(RgbaBuffer::new_resized(&mut buffer, bitmap_size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgba))
            }
        }
        ColorType::Indexed => Err(Error::Indexed(asset.to_string())),
        ColorType::Grayscale => {
            Ok(
                RgbBuffer::new_resized(&mut grayscale_to_rgb(&buffer), bitmap_size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgb),
            )
        }
        ColorType::GrayscaleAlpha => {
            Ok(
                RgbaBuffer::new_resized(&mut grayscale_alpha_to_rgba(&buffer), bitmap_size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgba),
            )
        }
    }
}

fn grayscale_to_rgb(buffer: &[u8]) -> Vec<u8> {
    let mut dst = vec![0; buffer.len() * STRIDE];
    for (src, dst) in buffer
        .iter()
        .zip(cast_slice_mut::<u8, [u8; STRIDE]>(&mut dst).iter_mut())
    {
        let c = *src;
        dst[0] = c;
        dst[1] = c;
        dst[2] = c;
    }
    dst
}

fn grayscale_alpha_to_rgba(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 2]>(buffer);
    let mut dst = vec![0; src.len() * 4];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; 4]>(&mut dst).iter_mut())
    {
        dst[0] = src[0];
        dst[1] = src[0];
        dst[2] = src[0];
        dst[3] = src[1];
    }
    dst
}

fn rgba_to_rgb(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 4]>(buffer);
    let mut dst = vec![0; src.len() * 3];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; 3]>(&mut dst).iter_mut())
    {
        dst[0] = src[1];
        dst[1] = src[2];
        dst[2] = src[3];
    }
    dst
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn test_grayscale_to_rgb() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_to_rgb(&vec![255; w * h]);
        assert_eq!(rgb.len(), w * h * STRIDE);
        assert!(rgb.into_iter().all(|c| c == 255));
    }

    #[test]
    fn test_grayscale_alpha_to_rgba() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_alpha_to_rgba(&vec![0; w * h * 2]);
        assert_eq!(rgb.len(), w * h * 4);
        assert!(rgb.into_iter().all(|c| c == 0));
    }

    #[test]
    fn test_load_png() {
        let image = load_image(
            &Asset::Path(PathBuf::from("test_image.png")),
            &Region::default(),
        )
        .unwrap()
        .unwrap();
        assert!(matches!(image, VisualBuffer::Rgb(_)));
    }
}
