use nodekit_rs_text::TextBuffers;
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;

pub enum Asset {
    Image(VisualBuffer),
    Text(TextBuffers),
    Video(Video),
}
