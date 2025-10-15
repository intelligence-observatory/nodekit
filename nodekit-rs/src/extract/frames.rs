use ffmpeg_next::util::frame::{audio::Audio, video::Video};

pub enum Frames {
    Audio(Vec<Audio>),
    Video(Vec<Video>),
}
