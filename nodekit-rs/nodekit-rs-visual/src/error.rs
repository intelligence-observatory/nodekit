use nodekit_rs_models::Rect;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create a resizable image buffer: {0}")]
    ImageResizeBuffer(fast_image_resize::ImageBufferError),
    #[error("Failed to resize image: {0}")]
    ImageResize(fast_image_resize::ResizeError),
    #[error("Failed to parse {0}: {1}")]
    HexColor(String, hex_color::ParseHexColorError),
    #[error("Failed to create RgbaRects from: {0}")]
    InvalidRgbaRects(Rect),
}
