use ffmpeg_next::util::frame::{audio::Audio, video::Video};

pub enum Frames {
    Audio(Vec<Audio>),
    Video(Vec<Video>),
}

impl Frames {
    pub fn data(&self) -> Box<dyn Iterator<Item = &[u8]> + '_> {
        match self {
            Self::Audio(audio) => Box::new(audio.iter().map(|a| a.data(0))),
            Self::Video(video) => Box::new(video.iter().map(|a| a.data(0))),
        }
    }
}
