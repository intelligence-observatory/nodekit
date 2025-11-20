//! Convert .png files into raw RGB24 bitmaps.
//!
//! Image formats currently supported:
//! - RGB24
//! - RGBA32
//! - Grayscale
//! - Grayscale Alpha

mod error;

use bytemuck::{cast_slice, cast_slice_mut};
pub use error::Error;
use nodekit_rs_models::{Image, Rect};
use nodekit_rs_visual::*;
use png::{ColorType, Decoder};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

/// Load an image into memory.
/// Resize the image as needed.
pub fn load(image: &Image, rect: Rect) -> Result<VisualBuffer, Error> {
    let decoder = Decoder::new(BufReader::new(
        File::open(&image.path).map_err(|e| Error::OpenFile(e, image.path.clone()))?,
    ));
    let mut reader = decoder
        .read_info()
        .map_err(|e| Error::Decode(e, image.path.clone()))?;
    let mut buffer = vec![
        0;
        reader
            .output_buffer_size()
            .ok_or(Error::BufferSize(image.path.clone()))?
    ];
    let info = reader
        .next_frame(&mut buffer)
        .map_err(|e| Error::Decode(e, image.path.clone()))?;
    // Convert to RGBA32.
    let buffer = convert(&image.path, &buffer[..info.buffer_size()], info.color_type)?;
    // Resize.
    VisualBuffer::new_resized(buffer, info.width, info.height, rect).map_err(Error::Visual)
}

/// Convert `buffer` from a `color_type` to RGBA32.
fn convert(path: &Path, buffer: &[u8], color_type: ColorType) -> Result<Vec<u8>, Error> {
    match color_type {
        ColorType::Rgb => Ok(buffer.to_vec()),
        ColorType::Indexed => Err(Error::Indexed(path.to_path_buf())),
        ColorType::Rgba => Ok(rgba_to_rgb(buffer)),
        ColorType::Grayscale => Ok(grayscale_to_rgb(buffer)),
        ColorType::GrayscaleAlpha => Ok(grayscale_alpha_to_rgb(buffer)),
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

fn grayscale_alpha_to_rgb(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 2]>(buffer);
    let mut dst = vec![0; src.len() * STRIDE];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; STRIDE]>(&mut dst).iter_mut())
    {
        let c = if src[1] == 255 {
            src[0]
        } else {
            let a = src[1] as f64 / 255.;
            let one_minus_src_a = 1. - a;
            let f = a + one_minus_src_a;
            overlay_c(src[0], 255, a, one_minus_src_a, f)
        };
        dst[0] = c;
        dst[1] = c;
        dst[2] = c;
    }
    dst
}

fn rgba_to_rgb(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 4]>(buffer);
    let mut dst = vec![0; src.len() * STRIDE];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; STRIDE]>(&mut dst).iter_mut())
    {
        overlay_pixel(src, dst);
    }
    dst
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_models::{Position, Size};
    use std::path::PathBuf;

    #[test]
    fn test_rgba_to_rgb() {
        let w = 400;
        let h = 300;
        let rgb = rgba_to_rgb(&vec![255; w * h * 4]);
        assert_eq!(rgb.len(), w * h * STRIDE);
        assert!(rgb.into_iter().all(|c| c == 255));
    }

    #[test]
    fn test_grayscale_to_rgb() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_to_rgb(&vec![255; w * h]);
        assert_eq!(rgb.len(), w * h * STRIDE);
        assert!(rgb.into_iter().all(|c| c == 255));
    }

    #[test]
    fn test_grayscale_alpha_to_rgb() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_alpha_to_rgb(&vec![0; w * h * 2]);
        assert_eq!(rgb.len(), w * h * STRIDE);
        assert!(rgb.into_iter().all(|c| c == 255));
    }

    #[test]
    fn test_load_png() {
        let image = load(
            &Image {
                path: PathBuf::from("test_image.png"),
            },
            Rect {
                size: Size { w: 1., h: 1. },
                position: Position { x: -0.5, y: -0.5 },
            },
        )
            .unwrap();
        assert_eq!(image.rect.size.w, 384);
        assert_eq!(image.rect.size.h, 768);
        assert_eq!(
            image.buffer.len(),
            image.rect.size.w * image.rect.size.h * STRIDE
        );
    }
}