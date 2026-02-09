use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Asset error: {0}")]
    Asset(nodekit_rs_asset::Error),
    #[error("Image asset is missing a file extension.")]
    NoExtension,
    #[error("Invalid image file extension: {0}")]
    InvalidExtension(String),
    #[error("png error: {0}")]
    Png(PngError),
    #[error("jpg error: {0}")]
    Jpg(JpgError),
    #[error("{0}")]
    Visual(nodekit_rs_visual::Error),
}

#[derive(Debug, Error)]
pub enum PngError {
    #[error("Failed to decode png {1}: {0}")]
    Decode(png::DecodingError, String),
    #[error("Failed to get the buffer size of {0}")]
    BufferSize(String),
    #[error("This image has indexed colors, which is not supported: {0}")]
    Indexed(String),
}

#[derive(Debug, Error)]
pub enum JpgError {
    #[error("Failed to decode jpg {1}: {0}")]
    Decode(jpeg_decoder::Error, String),
    #[error("No metadata found for jpg: {0}")]
    Metadata(String),
    #[error("jpg {} has an unsupported pixel format: {:?}", 1, 0)]
    PixelFormat(jpeg_decoder::PixelFormat, String),
}
