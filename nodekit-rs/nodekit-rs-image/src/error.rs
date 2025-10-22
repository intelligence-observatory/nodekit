use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to open image file: {0}")]
    OpenFile(std::io::Error),
    #[error("Error when decoding png file: {0}")]
    Png(png::DecodingError),
    #[error("Error when resizing image: {0}")]
    Resize(fast_image_resize::ResizeError),
    #[error("Error when creating a resizeable image buffer: {0}")]
    ImageBuffer(fast_image_resize::ImageBufferError),
}
