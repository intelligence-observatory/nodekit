use blittle::ClippedRect;
use nodekit_rs_text::{TextBuffers, TextEntryBuffers};
#[cfg(target_os = "linux")]
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;

pub enum Asset {
    Image(VisualBuffer),
    Text(TextBuffers),
    TextEntry(Box<TextEntryBuffers>),
    #[cfg(target_os = "linux")]
    Video(Video),
}

impl Asset {
    pub const fn rect(&self) -> Option<ClippedRect> {
        match self {
            Self::Image(buffer) => Some(buffer.rect()),
            Self::Text(buffers) => buffers.rect(),
            Self::TextEntry(buffers) => Some(buffers.rect),
            #[cfg(target_os = "linux")]
            Self::Video(video) => Some(video.rgb_buffer.rect),
        }
    }
}
