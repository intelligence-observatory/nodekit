use crate::{Error, JpgError, convert::*};
use blittle::Size;
use jpeg_decoder::{Decoder, PixelFormat};
use nodekit_rs_models::Region;
use nodekit_rs_visual::{RgbBuffer, VisualBuffer};
use std::io::Cursor;

pub fn load_jpg(
    asset: &str,
    region: &Region,
    buffer: Vec<u8>,
) -> Result<Option<VisualBuffer>, Error> {
    let mut decoder = Decoder::new(Cursor::new(buffer));
    let buffer = decoder
        .decode()
        .map_err(|e| Error::Jpg(JpgError::Decode(e, asset.to_string())))?;
    let info = decoder
        .info()
        .ok_or(Error::Jpg(JpgError::Metadata(asset.to_string())))?;
    let size = Size {
        w: info.width as usize,
        h: info.height as usize,
    };
    // Convert grayscale.
    let mut buffer = match &info.pixel_format {
        PixelFormat::L8 => Ok(grayscale_alpha_to_rgba(buffer)),
        PixelFormat::RGB24 => Ok(buffer),
        other => Err(Error::Jpg(JpgError::PixelFormat(*other, asset.to_string()))),
    }?;
    match RgbBuffer::new_resized(&mut buffer, size, region) {
        Ok(buffer) => Ok(buffer.map(VisualBuffer::Rgb)),
        Err(error) => Err(Error::Visual(error)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_asset::load_asset;
    use nodekit_rs_models::card::Asset;
    use std::path::PathBuf;

    #[test]
    fn test_load_jpg() {
        let asset = Asset::Path(PathBuf::from("test_images/test_image.jpg"));
        let buffer = load_asset(&asset).unwrap();
        load_jpg(&asset.to_string(), &Region::default(), buffer)
            .unwrap()
            .unwrap();
    }
}
