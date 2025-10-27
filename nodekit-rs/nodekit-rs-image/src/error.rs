use std::path::PathBuf;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create {1}: {0}")]
    OpenFile(std::io::Error, PathBuf),
    #[error("Failed to decode {1}: {0}")]
    Decode(png::DecodingError, PathBuf),
    #[error("Failed to get the buffer size of {0}")]
    BufferSize(PathBuf),
    #[error("This image has indexed colors, which is not supported: {0}")]
    Indexed(PathBuf),
    #[error("Failed to create a resizable image buffer: {0}")]
    ImageResizeBuffer(fast_image_resize::ImageBufferError),
    #[error("Failed to resize image: {0}")]
    ImageResize(fast_image_resize::ResizeError),
}
