use blittle::ClippedRect;
use nodekit_rs_visual::{Board, RgbaBuffer, VisualBuffer};

pub struct TextBuffers {
    pub background: Option<VisualBuffer>,
    pub foreground: Option<RgbaBuffer>,
}

impl TextBuffers {
    pub fn blit(&self, board: &mut Board) {
        if let Some(background) = &self.background {
            board.blit(background);
        }
        if let Some(foreground) = &self.foreground {
            board.overlay_rgba(foreground);
        }
    }
    
    pub const fn rect(&self) -> Option<ClippedRect> {
        match &self.background {
            Some(buffer) => Some(buffer.rect()),
            None => match &self.foreground {
                Some(foreground) => Some(foreground.rect),
                None => None
            }
        }
    }
}
