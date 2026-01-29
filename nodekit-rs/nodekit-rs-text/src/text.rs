use blittle::ClippedRect;
use nodekit_rs_visual::{Board, RgbaBuffer};

/// Background and rendered text.
pub struct Text {
    pub background: Option<RgbaBuffer>,
    pub foreground: Option<RgbaBuffer>,
}

impl Text {
    pub fn blit(&self, board: &mut Board) {
        if let Some(background) = &self.background {
            board.overlay_rgba(background);
        }
        if let Some(foreground) = &self.foreground {
            board.overlay_rgba(foreground);
        }
    }

    pub const fn rect(&self) -> Option<ClippedRect> {
        match &self.background {
            Some(buffer) => Some(buffer.rect),
            None => match &self.foreground {
                Some(foreground) => Some(foreground.rect),
                None => None,
            },
        }
    }
}
