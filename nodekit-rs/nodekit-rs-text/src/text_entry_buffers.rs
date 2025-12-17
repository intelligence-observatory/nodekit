use blittle::ClippedRect;
use nodekit_rs_visual::RgbaBuffer;
use crate::gutter::Gutter;

pub struct TextEntryBuffers<'t> {
    pub background: Option<RgbaBuffer>,
    pub text: Option<RgbaBuffer>,
    pub gutter: Gutter<'t>
}

impl TextEntryBuffers<'_> {
    pub fn new(text: Option<RgbaBuffer>, rect: ClippedRect) -> Self {
        let gutter = Gutter::new(rect.dst_position, rect.src_size.w);
        Self {
            background: None, // TODO
            text,
            gutter
        }
    }

    /// TODO include gutter.
    pub const fn rect(&self) -> Option<ClippedRect> {
        match &self.background {
            Some(buffer) => Some(buffer.rect),
            None => match &self.text {
                Some(foreground) => Some(foreground.rect),
                None => None,
            },
        }
    }
}
