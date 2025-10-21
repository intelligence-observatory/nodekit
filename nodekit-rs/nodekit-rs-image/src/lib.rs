//! Load image files as a raw RGB24 bitmaps.

mod error;

use std::fs::File;
use std::io::{BufReader, ErrorKind};
pub use error::Error;
use std::path::Path;
use blittle::Size;
use bytemuck::cast_slice;
use png::{ColorType, Decoder, DecodingError, Transformations};

/// A raw RGB24 pixel map and the image's dimensions.
pub struct Image {
    pub bytes: Vec<u8>,
    pub size: Size
}

impl Image {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Self, Error> {
        let file = File::open(path.as_ref()).map_err(Error::OpenFile)?;
        Self::decode(file).map_err(Error::Png)
    }

    fn decode(file: File) -> Result<Self, DecodingError> {
        let mut decoder = Decoder::new(BufReader::new(file));
        decoder.set_transformations(Transformations::STRIP_16);
        let mut reader = decoder.read_info()?;
        let info = reader.info();
        // Get the size of the image.
        let (width, height) = info.size();
        let size = Size {
            w: width as usize,
            h: height as usize
        };
        let output_size = reader.output_buffer_size().ok_or(DecodingError::IoError(std::io::Error::new(ErrorKind::InvalidData, "Invalid output buffer size")))?;
        let mut buffer = vec![0; output_size];
        let info = reader.next_frame(&mut buffer)?;
        let bytes = &buffer[..info.buffer_size()];
        // Convert to RGB.
        let bytes = match info.color_type {
            ColorType::Grayscale | ColorType::Indexed => Self::grayscale_to_rgb(bytes),
            ColorType::GrayscaleAlpha => Self::grayscale_alpha_to_rgb(bytes),
            ColorType::Rgb => bytes.to_vec(),
            ColorType::Rgba => Self::rgba_to_rgb(bytes),
        };
        Ok(Self {
            bytes,
            size
        })
    }

    fn grayscale_to_rgb(bytes: &[u8]) -> Vec<u8> {
        let mut out = vec![[0; 3]; bytes.len() * 3];
        for (src, dst) in bytes.iter().zip(out.iter_mut()) {
            let src = *src;
            *dst = [src, src, src];
        }
        cast_slice::<[u8; 3], u8>(&out).to_vec()
    }

    fn grayscale_alpha_to_rgb(bytes: &[u8]) -> Vec<u8> {
        let bytes = cast_slice::<u8, [u8; 2]>(bytes);
        let mut out = vec![[0; 3]; bytes.len()];
        for (src, dst) in bytes.iter().zip(out.iter_mut()) {
            let src = src[0];
            *dst = [src, src, src];
        }
        cast_slice::<[u8; 3], u8>(&out).to_vec()
    }

    fn rgba_to_rgb(bytes: &[u8]) -> Vec<u8> {
        let bytes = cast_slice::<u8, [u8; 4]>(bytes);
        let mut out = vec![[0; 3]; bytes.len()];
        for (src, dst) in bytes.iter().zip(out.iter_mut()) {
            dst.copy_from_slice(&src[0..3]);
        }
        cast_slice::<[u8; 3], u8>(&out).to_vec()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decode_png() {
        let path = "test_image.png";
        let mut decoder = Decoder::new(BufReader::new(File::open(path).unwrap()));
        decoder.set_transformations(Transformations::STRIP_16);
        let reader = decoder.read_info().unwrap();
        let info = reader.info();
        assert_eq!(info.color_type, ColorType::Rgba);
        let (w, h) = info.size();
        let image = Image::new(path).unwrap();
        assert_eq!(image.size.w, w as usize);
        assert_eq!(image.size.h, h as usize);
        assert_eq!(image.bytes.len(), (w * h * 3) as usize);
    }
}