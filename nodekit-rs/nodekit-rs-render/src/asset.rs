use blittle::ClippedRect;
use nodekit_rs_text::TextBuffers;
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;

pub enum Asset {
    Image(VisualBuffer),
    Text(TextBuffers),
    Video(Video),
}

impl Asset {
    pub const fn rect(&self) -> Option<ClippedRect> {
        match self {
            Self::Image(buffer) => Some(buffer.rect()),
            Self::Text(buffers) => buffers.rect(),
            Self::Video(video) => Some(video.rgb_buffer.rect),
        }
    }
}
