use hex_color::ParseHexColorError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to parse color: {0}")]
    HexColor(ParseHexColorError),
    #[error("Video error: {0}")]
    Video(nodekit_rs_video::Error),
    #[error("Error loading image: {0}")]
    Image(nodekit_rs_image::Error),
    #[error("Error creating visual frame: {0}")]
    Visual(nodekit_rs_visual::Error),
    #[error("Invalid asset locator: {:?}", 0)]
    AssetLocator(nodekit_rs_graph::AssetLocator),
}
