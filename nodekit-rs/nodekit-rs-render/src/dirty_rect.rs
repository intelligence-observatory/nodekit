use blittle::ClippedRect;
use nodekit_rs_text::TextBuffers;
use nodekit_rs_video::Video;
use nodekit_rs_visual::{RgbBuffer, RgbaBuffer, VisualBuffer};

#[derive(Copy, Clone, Debug)]
pub struct DirtyRect {
    pub rect: ClippedRect,
    pub rgb: bool,
}

impl DirtyRect {
    pub fn from_text_buffers(value: &TextBuffers) -> Option<Self> {
        match &value.background {
            Some(buffer) => Some(Self::from(buffer)),
            None => match &value.foreground {
                Some(foreground) => Some(Self::from(foreground)),
                None => None,
            },
        }
    }
}

impl From<&RgbBuffer> for DirtyRect {
    fn from(value: &RgbBuffer) -> Self {
        Self {
            rect: value.rect,
            rgb: true,
        }
    }
}

impl From<&RgbaBuffer> for DirtyRect {
    fn from(value: &RgbaBuffer) -> Self {
        Self {
            rect: value.rect,
            rgb: false,
        }
    }
}

impl From<&VisualBuffer> for DirtyRect {
    fn from(value: &VisualBuffer) -> Self {
        match value {
            VisualBuffer::Rgb(buffer) => Self::from(buffer),
            VisualBuffer::Rgba(buffer) => Self::from(buffer),
        }
    }
}

impl From<&Video> for DirtyRect {
    fn from(value: &Video) -> Self {
        Self::from(&value.rgb_buffer)
    }
}
