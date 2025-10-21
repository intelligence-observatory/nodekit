use hex_color::ParseHexColorError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Asset manager error: {0}")]
    Asset(nodekit_rs_asset::Error),
    #[error("Failed to parse color: {0}")]
    HexColor(ParseHexColorError),
    #[error("Failed to create video frame extractor: {0}")]
    FrameExtractor(ffmpeg_next::Error),
}
