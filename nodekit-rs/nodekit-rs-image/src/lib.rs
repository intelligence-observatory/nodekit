//! Convert .png files into raw bitmaps.

mod convert;
mod error;
mod jpg;
mod png;

use crate::jpg::load_jpg;
use crate::png::load_png;
pub use error::{Error, JpgError, PngError};
use nodekit_rs_asset::load_asset;
use nodekit_rs_models::{Region, card::Asset};
use nodekit_rs_visual::*;

/// Load an image `asset` into memory. Resize the image to fit within `region`.
pub fn load_image(asset: &Asset, region: &Region) -> Result<Option<VisualBuffer>, Error> {
    let buffer = load_asset(asset).map_err(Error::Asset)?;
    let a = asset.to_string();
    // Get the file extension.
    match asset.extension().ok_or(Error::NoExtension)?.as_str() {
        "png" => load_png(&a, region, buffer),
        "jpg" | "jpeg" => load_jpg(&a, region, buffer),
        "svg" => todo!(),
        other => Err(Error::InvalidExtension(other.to_string())),
    }
}
