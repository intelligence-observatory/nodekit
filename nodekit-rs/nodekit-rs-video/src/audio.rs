use crate::audio_format::AudioFormat;

pub struct Audio {
    pub frame: Vec<u8>,
    pub rate: u32,
    pub channels: u16,
    pub format: AudioFormat,
}
