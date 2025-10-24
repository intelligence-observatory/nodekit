use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Image error: {0}")]
    Image(nodekit_rs_image::Error),
    #[error("Video error: {0}")]
    Video(nodekit_rs_video::Error),
    #[error("Failed to create a resizable image buffer: {0}")]
    ImageResizeBuffer(fast_image_resize::ImageBufferError),
    #[error("Failed to resize image: {0}")]
    ImageResize(fast_image_resize::ResizeError),
}
