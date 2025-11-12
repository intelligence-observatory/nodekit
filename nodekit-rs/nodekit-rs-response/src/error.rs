use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create a resizable image buffer: {0}")]
    ImageResizeBuffer(fast_image_resize::ImageBufferError),
    #[error("Failed to resize image: {0}")]
    ImageResize(fast_image_resize::ResizeError),
    #[error("Failed to encode response: {0}")]
    Encode(bincode::error::EncodeError),
}
