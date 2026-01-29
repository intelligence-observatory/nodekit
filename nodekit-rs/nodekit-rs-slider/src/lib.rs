mod thumb;
mod thumb_color;
mod track;

use nodekit_rs_visual::RgbaBuffer;

const S: f32 = 0.7;

pub struct Slider {
    background: RgbaBuffer,
    foreground_buffer: RgbaBuffer
}