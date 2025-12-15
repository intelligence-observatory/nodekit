use blittle::ClippedRect;
use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;

pub enum VisualBuffer {
    Rgb(RgbBuffer),
    Rgba(RgbaBuffer),
}

impl VisualBuffer {
    pub const fn rect(&self) -> ClippedRect {
        match self {
            Self::Rgb(buffer) => buffer.rect,
            Self::Rgba(buffer) => buffer.rect
        }
    }
}