use crate::convert::*;
use crate::error::{Error, PngError};
use blittle::Size;
use bytemuck::cast_slice;
use nodekit_rs_models::Region;
use nodekit_rs_visual::*;
use png::{ColorType, Decoder};
use std::io::Cursor;

/// Load a png `asset` into memory. Resize the image to fit within `region`.
pub fn load_png(
    asset: &str,
    region: &Region,
    buffer: Vec<u8>,
) -> Result<Option<VisualBuffer>, Error> {
    let decoder = Decoder::new(Cursor::new(buffer));
    let mut reader = decoder
        .read_info()
        .map_err(|e| Error::Png(PngError::Decode(e, asset.to_string())))?;
    let mut buffer = vec![
        0;
        reader
            .output_buffer_size()
            .ok_or(Error::Png(PngError::BufferSize(asset.to_string())))?
    ];
    let info = reader
        .next_frame(&mut buffer)
        .map_err(|e| Error::Png(PngError::Decode(e, asset.to_string())))?;
    let size = Size {
        w: info.width as usize,
        h: info.height as usize,
    };
    match info.color_type {
        ColorType::Rgb => Ok(RgbBuffer::new_resized(&mut buffer, size, region)
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
                    RgbBuffer::new_resized(&mut rgba_to_rgb(buffer), size, region)
                        .map_err(Error::Visual)?
                        .map(VisualBuffer::Rgb),
                )
            } else {
                Ok(RgbaBuffer::new_resized(&mut buffer, size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgba))
            }
        }
        ColorType::Indexed => Err(Error::Png(PngError::Indexed(asset.to_string()))),
        ColorType::Grayscale => {
            Ok(
                RgbBuffer::new_resized(&mut grayscale_to_rgb(buffer), size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgb),
            )
        }
        ColorType::GrayscaleAlpha => {
            Ok(
                RgbaBuffer::new_resized(&mut grayscale_alpha_to_rgba(buffer), size, region)
                    .map_err(Error::Visual)?
                    .map(VisualBuffer::Rgba),
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_asset::load_asset;
    use nodekit_rs_models::card::Asset;
    use std::path::PathBuf;

    #[test]
    fn test_load_png() {
        let asset = Asset::Path(PathBuf::from("test_images/test_image.png"));
        let buffer = load_asset(&asset).unwrap();
        let image = load_png(&asset.to_string(), &Region::default(), buffer)
            .unwrap()
            .unwrap();
        assert!(matches!(image, VisualBuffer::Rgb(_)));
    }
}
