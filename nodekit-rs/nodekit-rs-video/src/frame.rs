use ffmpeg_next::util::frame::{audio::Audio, video::Video};

pub struct Frame {
    pub video: Video,
    pub audio: Option<Audio>,
}
