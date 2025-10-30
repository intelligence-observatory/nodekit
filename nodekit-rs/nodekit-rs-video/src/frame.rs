use ffmpeg_next::util::frame::video::Video;
use nodekit_rs_response::AudioFrame;

pub struct Frame {
    pub video: Video,
    pub audio: Option<AudioFrame>,
}
