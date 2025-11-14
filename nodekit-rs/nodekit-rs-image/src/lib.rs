//! Convert .png files into raw RGB24 bitmaps.
//!
//! Image formats currently supported:
//! - RGB24
//! - RGBA32
//! - Grayscale
//! - Grayscale Alpha

mod error;

use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use bytemuck::cast_slice;
use png::{ColorType, Decoder};
use nodekit_rs_models::{Image, Rect};
use nodekit_rs_visual::*;
pub use error::Error;

/// Blit an `image` onto the `board` within a card's `rect`.
pub fn blit_image(image: &Image, rect: Rect, board: &mut [u8]) -> Result<(), Error> {
    load(image)?.blit(rect, board).map_err(Error::Visual)
}

fn load(image: &Image) -> Result<VisualBuffer, Error> {
    let decoder = Decoder::new(BufReader::new(
        File::open(&image.path).map_err(|e|  Error::OpenFile(e, image.path.clone()))?,
    ));
    let mut reader = decoder
        .read_info()
        .map_err(|e|  Error::Decode(e, image.path.clone()))?;
    let mut buffer = vec![
        0;
        reader
            .output_buffer_size()
            .ok_or(Error::BufferSize(image.path.clone()))?
    ];
    let info = reader
        .next_frame(&mut buffer)
        .map_err(|e|  Error::Decode(e, image.path.clone()))?;
    // Convert to RGB32.
    let buffer = convert(
        &image.path,
        &buffer[..info.buffer_size()],
        info.color_type,
    )?;
    Ok(VisualBuffer {
        buffer,
        width: info.width,
        height: info.height
    })
}

/// Convert `buffer` from a `color_type` to RGB24.
fn convert(path: &Path, buffer: &[u8], color_type: ColorType) -> Result<Vec<u8>, Error> {
    match color_type {
        ColorType::Rgb => Ok(rgb_to_rgba(buffer)),
        ColorType::Indexed => Err(Error::Indexed(path.to_path_buf())),
        ColorType::Rgba => Ok(buffer.to_vec()),
        ColorType::Grayscale => Ok(grayscale_to_rgba(buffer)),
        ColorType::GrayscaleAlpha => Ok(grayscale_alpha_to_rgba(buffer)),
    }
}

fn grayscale_to_rgba(buffer: &[u8]) -> Vec<u8> {
    let mut dst = vec![[0; STRIDE]; buffer.len() * STRIDE];
    for (src, dst) in buffer.iter().zip(dst.iter_mut()) {
        let src = *src;
        *dst = [src, src, src, 255];
    }
    cast_slice::<[u8; STRIDE], u8>(&dst).to_vec()
}

fn grayscale_alpha_to_rgba(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 2]>(buffer);
    let mut dst = vec![[0; STRIDE]; src.len()];
    for (src, dst) in src.iter().zip(dst.iter_mut()) {
        let c = src[0];
        *dst = [c, c, c, src[1]];
    }
    cast_slice::<[u8; STRIDE], u8>(&dst).to_vec()
}

fn rgb_to_rgba(buffer: &[u8]) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 3]>(buffer);
    let mut dst = vec![[0; STRIDE]; src.len()];
    for (src, dst) in src.iter().zip(dst.iter_mut()) {
        *dst = [src[0], src[1], src[2], 255];
    }
    cast_slice::<[u8; STRIDE], u8>(&dst).to_vec()
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;
    use super::*;

    #[test]
    fn test_load_png() {
        let width = 300;
        let height = 600;
        let image = load(&Image {
            path: PathBuf::from("test_image.png")
        }).unwrap();
        assert_eq!(image.width, width);
        assert_eq!(image.height, height);
        assert_eq!(image.buffer.len(), (width * height * STRIDE as u32) as usize);
    }
}
