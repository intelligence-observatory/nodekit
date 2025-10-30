use thiserror::Error;

#[derive(Debug, Error)]
pub enum VisualFrameError {
    #[error("Failed to create a resizable image buffer: {0}")]
    ImageResizeBuffer(fast_image_resize::ImageBufferError),
    #[error("Failed to resize image: {0}")]
    ImageResize(fast_image_resize::ResizeError),
}
