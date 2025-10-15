use crate::{Frames, Board, video::Video};

pub struct State<'s> {
    pub board: Board,
    pub videos: Vec<Video<'s>>,
}

impl State<'_> {
    pub fn step() {
        
    }
}

