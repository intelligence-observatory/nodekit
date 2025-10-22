use hex_color::ParseHexColorError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Asset manager error: {0}")]
    Asset(nodekit_rs_asset::Error),
    #[error("Failed to parse color: {0}")]
    HexColor(ParseHexColorError),
    #[error("Video error: {0}")]
    Video(nodekit_rs_video::Error),
    #[error("Got errors when trying to load assets: {:?}", 0)]
    LoadAssets(Vec<nodekit_rs_asset::Error>),
    #[error("Error loading image: {0}")]
    Image(nodekit_rs_image::Error),
}
