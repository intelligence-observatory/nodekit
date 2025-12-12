use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Asset error: {0}")]
    Asset(nodekit_rs_asset::Error),
    #[error("Failed to decode image: {0}")]
    Decode(png::DecodingError, String),
    #[error("Failed to get the buffer size of {0}")]
    BufferSize(String),
    #[error("This image has indexed colors, which is not supported: {0}")]
    Indexed(String),
    #[error("{0}")]
    Visual(nodekit_rs_visual::Error),
}
