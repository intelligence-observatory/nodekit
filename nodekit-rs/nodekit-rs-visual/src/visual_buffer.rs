use crate::rgb_buffer::RgbBuffer;
use crate::rgba_buffer::RgbaBuffer;

pub enum VisualBuffer {
    Rgb(RgbBuffer),
    Rgba(RgbaBuffer),
}
