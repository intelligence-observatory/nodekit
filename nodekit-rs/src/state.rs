use crate::{Frames, Board, video::Video};

pub struct State {
    pub board: Board,
    pub videos: Vec<Video>,
    video_frames: Vec<Frames>
}

