mod extractor;
mod frame;

use crate::packet_iter::PacketIter;
use extractor::{AudioExtractor, VideoExtractor};
use ffmpeg_next::format::input;
use ffmpeg_next::util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame};
pub use frame::Frame;
use std::collections::VecDeque;
use std::path::Path;

pub struct Extractor<'e> {
    packet_iter: PacketIter<'e>,
    audio: Option<AudioExtractor>,
    video: VideoExtractor,
    video_frames: VecDeque<VideoFrame>,
    audio_frames: VecDeque<AudioFrame>,
}

impl Extractor<'_> {
    pub fn new<P: AsRef<Path>>(
        path: P,
        width: u32,
        height: u32,
    ) -> Result<Self, ffmpeg_next::Error> {
        let input = input(path.as_ref())?;
        let audio = AudioExtractor::new(&input).ok();
        let video = VideoExtractor::new(&input, width, height)?;
        let packet_iter = PacketIter::from(input);
        Ok(Self {
            packet_iter,
            audio,
            video,
            video_frames: VecDeque::default(),
            audio_frames: VecDeque::default(),
        })
    }

    pub fn get_next_frame(&mut self) -> Result<Option<Frame>, ffmpeg_next::Error> {
        if let Some((stream, packet)) = self.packet_iter.next() {
            if let Some(audio) = self.audio.as_mut()
                && stream.index() == audio.stream_index()
            {
                audio.send_packet(&packet)?;
                while let Ok(frame) = audio.extract_next_frame() {
                    self.audio_frames.push_back(frame);
                }
            } else if stream.index() == self.video.stream_index() {
                self.video.send_packet(&packet)?;
                while let Ok(frame) = self.video.extract_next_frame() {
                    self.video_frames.push_back(frame);
                }
            }
        }
        // There is a video frame.
        // There is an expected audio frame.
        let have_audio_frame = if self.audio.is_some() {
            !self.audio_frames.is_empty()
        } else {
            true
        };
        if !self.video_frames.is_empty() && have_audio_frame {
            let video = self.video_frames.pop_front().unwrap();
            let audio = self.audio_frames.pop_front();
            Ok(Some(Frame { video, audio }))
        } else {
            Ok(None)
        }
    }
}
