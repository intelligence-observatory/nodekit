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
}
