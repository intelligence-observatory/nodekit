mod extract;
mod state;
mod video;

pub use extract::{Extractor, Frames};

pub(crate) const BOARD_D: usize = 768;
pub(crate) type Board = [u8; BOARD_D * BOARD_D * 3];