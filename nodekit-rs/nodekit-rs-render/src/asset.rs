use blittle::ClippedRect;
use nodekit_rs_slider::Slider;
use nodekit_rs_text::{Text, TextEntry};
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;

/// A renderable asset.
pub enum Asset {
    Image(VisualBuffer),
    Slider(Slider),
    Text(Text),
    TextEntry(TextEntry),
    Video(Video),
}

impl Asset {
    pub const fn rect(&self) -> Option<ClippedRect> {
        match self {
            Self::Image(buffer) => Some(buffer.rect()),
            Self::Slider(slider) => Some(slider.rect),
            Self::Text(text) => text.rect(),
            Self::TextEntry(buffers) => Some(buffers.rect()),
            Self::Video(video) => Some(video.rgb_buffer.rect),
        }
    }
}
