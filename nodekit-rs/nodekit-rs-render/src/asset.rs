use nodekit_rs_video::Video;
use nodekit_rs_visual::{RgbaBuffer, VisualBuffer};

pub enum Asset {
    Image(VisualBuffer),
    Text(Vec<RgbaBuffer>),
    Video(Video),
}
