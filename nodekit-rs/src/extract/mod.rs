mod extractor;
mod frames;

use extractor::{AudioExtractor, VideoExtractor};
use ffmpeg_next::format::context::Input;
use ffmpeg_next::format::input;
use ffmpeg_next::{Packet, Stream as FfmpegStream};
use std::path::Path;

pub use frames::Frames;

pub struct Extractor {
    pub input: Input,
    audio: Option<AudioExtractor>,
    video: VideoExtractor,
}

impl Extractor {
    pub fn new<P: AsRef<Path>>(
        path: P,
        width: u32,
        height: u32,
    ) -> Result<Self, ffmpeg_next::Error> {
        let input = input(path.as_ref())?;
        let audio = AudioExtractor::new(&input).ok();
        let video = VideoExtractor::new(&input, width, height)?;
        Ok(Self {
            input,
            audio,
            video,
        })
    }

    pub fn next_frames(
        &mut self,
        stream: FfmpegStream,
        packet: Packet,
    ) -> Result<Option<Frames>, ffmpeg_next::Error> {
        if let Some(audio) = self.audio.as_mut()
            && stream.index() == audio.stream_index()
        {
            let mut frames = Vec::default();
            audio.send_packet(&packet)?;
            while let Ok(frame) = audio.extract_next_frame() {
                frames.push(frame);
            }
            Ok(Some(Frames::Audio(frames)))
        } else if stream.index() == self.video.stream_index() {
            let mut frames = Vec::default();
            self.video.send_packet(&packet)?;
            while let Ok(frame) = self.video.extract_next_frame() {
                frames.push(frame);
            }
            Ok(Some(Frames::Video(frames)))
        } else {
            Ok(None)
        }
    }
}
