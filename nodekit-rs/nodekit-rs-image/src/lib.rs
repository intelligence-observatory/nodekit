//! Load image files as a raw RGB24 bitmaps.

mod decoded_image;
mod error;

use blittle::Size;
use bytemuck::cast_slice;
use decoded_image::DecodedImage;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use png::{ColorType, Decoder, DecodingError, Transformations};
use std::{
    fs::File,
    io::{BufReader, ErrorKind},
    path::Path,
};

/// A raw RGB24 pixel map and the image's dimensions.
#[derive(Default)]
pub struct Image {
    pub bytes: Vec<u8>,
    pub size: Size,
}

impl Image {
    /// Load an image file from `path`.
    /// `width` and `height` are the dimensions that the image will be scaled to,
    /// *not* the original dimensions.
    pub fn load<P: AsRef<Path>>(path: P, width: u32, height: u32) -> Result<Self, Error> {
        // Open the file.
        let file = File::open(path.as_ref()).map_err(Error::OpenFile)?;
        // Decode the image into raw RGB24.
        let mut image = Self::decode(file).map_err(Error::Png)?;
        // Resize the image.
        Self::resize(&mut image, width, height)
    }

    fn decode(file: File) -> Result<DecodedImage, DecodingError> {
        let mut decoder = Decoder::new(BufReader::new(file));
        decoder.set_transformations(Transformations::STRIP_16);
        let mut reader = decoder.read_info()?;
        let info = reader.info();
        // Get the size of the image.
        let (width, height) = info.size();
        let output_size =
            reader
                .output_buffer_size()
                .ok_or(DecodingError::IoError(std::io::Error::new(
                    ErrorKind::InvalidData,
                    "Invalid output buffer size",
                )))?;
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
        Ok(DecodedImage {
            bytes,
            width,
            height,
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

    fn resize(image: &mut DecodedImage, width: u32, height: u32) -> Result<Self, Error> {
        // No need to resize.
        if image.width == width && image.height == height {
            let mut bytes = vec![0; image.bytes.len()];
            bytes.copy_from_slice(&image.bytes);
            Ok(Self {
                bytes,
                size: Size {
                    w: width as usize,
                    h: height as usize,
                },
            })
        } else {
            let src = fast_image_resize::images::Image::from_slice_u8(
                image.width,
                image.height,
                &mut image.bytes,
                PixelType::U8x3,
            )
            .map_err(Error::ImageBuffer)?;
            let mut dst = fast_image_resize::images::Image::new(width, height, PixelType::U8x3);
            let mut resizer = Resizer::new();
            let options = ResizeOptions {
                algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
                cropping: SrcCropping::None,
                mul_div_alpha: false,
            };
            resizer
                .resize(&src, &mut dst, Some(&options))
                .map_err(Error::Resize)?;
            Ok(Self {
                bytes: dst.into_vec(),
                size: Size {
                    w: width as usize,
                    h: height as usize,
                },
            })
        }
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
        let d = 1024;
        let image = Image::load(path, d, d).unwrap();
        assert_eq!(image.size.w, d as usize);
        assert_eq!(image.size.h, d as usize);
        assert_eq!(image.bytes.len(), (d * d * 3) as usize);
    }
}
