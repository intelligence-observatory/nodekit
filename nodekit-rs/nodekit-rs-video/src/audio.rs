use crate::{AudioFormat, AudioRate};

pub struct Audio {
    pub frame: Vec<u8>,
    pub rate: AudioRate,
    pub channels: u16,
    pub format: AudioFormat,
}
