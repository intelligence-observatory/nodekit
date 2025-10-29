use ffmpeg_next::util::frame::video::Video;
use nodekit_rs_audio::AudioFrame;

pub struct Frame {
    pub video: Video,
    pub audio: Option<AudioFrame>,
}
