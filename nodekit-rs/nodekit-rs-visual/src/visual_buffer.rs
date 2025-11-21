use crate::{RgbBuffer, RgbaBuffer};

pub enum VisualBuffer {
    Rgb(RgbBuffer),
    Rgba(RgbaBuffer)
}

impl VisualBuffer {
    pub fn blit(&self, board: &mut [u8]) {
        match self {
            Self::Rgb(buffer) => buffer.blit(board),
            Self::Rgba(buffer) => buffer.blit(board),
        }
    }
}