use super::error::Error;
use super::write::*;
use ffmpeg_next::codec::decoder::Audio;
use std::fs::File;

pub struct AudioParams {
    channels: u32,
    frame_size: u32,
}

impl AudioParams {
    pub fn new(audio: &Audio) -> Self {
        let channels = audio.channels() as u32;
        let frame_size = audio.frame_size();
        Self {
            channels,
            frame_size,
        }
    }

    pub fn write(self, file: &mut File) -> Result<(), Error> {
        write_u32(file, self.channels)?;
        write_u32(file, self.frame_size)
    }
}
