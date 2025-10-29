//! This crate provides the means of extracting frame data from a video.
//! It doesn't provide any blitting or processing functionality.

mod extraction;
mod extractor;
mod frame;
mod packet_iter;

pub use extraction::Extraction;
use extractor::{AudioExtractor, VideoExtractor};
pub use ffmpeg_next::Error;
use ffmpeg_next::{
    format::input,
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame},
};
pub use frame::Frame;
use packet_iter::PacketIter;
use std::{
    collections::VecDeque,
    path::{Path, PathBuf},
};
use ffmpeg_next::format::Sample;
use nodekit_rs_audio::AudioFormat;

/// Extract frames from a video.
/// This opens a video and keeps it open until `FrameExtractor` is dropped.
pub struct FrameExtractor {
    /// A packet iterator that consumes the ffmpeg input struct.
    packet_iter: PacketIter<'static>,
    /// `PacketIter` can successfully retrieve frames but not streams.
    /// A pointer is dereferenced at some point and I don't know why.
    /// But all we need to know about the streams is their index.
    /// So, those indices are cached here.
    streams: Vec<usize>,
    /// The current index in `streams`.
    index: usize,
    /// None if the video doesn't have audio.
    audio: Option<AudioExtractor>,
    video: VideoExtractor,
    /// Pending video frames. The extractors can extract more than one frame.
    video_frames: VecDeque<VideoFrame>,
    /// Pending audio frames. The extractors can extract more than one frame.
    audio_frames: VecDeque<AudioFrame>,
    /// The path to the video file. Required for looping.
    path: PathBuf,
}

impl FrameExtractor {
    /// - `path` is the path to the video.
    /// - `width` and `height` are the dimensions that we want to scale each video frame to.
    pub fn new<P: AsRef<Path>>(
        path: P,
        width: u32,
        height: u32,
        muted: bool,
    ) -> Result<Self, ffmpeg_next::Error> {
        let mut input = input(path.as_ref())?;
        // Extract packets.
        let streams = input
            .packets()
            .map(|(stream, _)| stream.index())
            .collect::<Vec<usize>>();
        let input = ffmpeg_next::format::input(path.as_ref())?;
        let audio = if muted {
            None
        } else {
            AudioExtractor::new(&input).ok()
        };
        let video = VideoExtractor::new(&input, width, height)?;
        let packet_iter = PacketIter::from(input);
        Ok(Self {
            packet_iter,
            audio,
            video,
            video_frames: VecDeque::default(),
            audio_frames: VecDeque::default(),
            streams,
            index: 0,
            path: path.as_ref().to_path_buf(),
        })
    }

    /// Read packets and try to get a new frame.
    ///
    /// Returns an error if there was an underlying extraction error or if it's the end of the file.
    /// Returns None if there are no frames yet.
    pub fn get_next_frame(&mut self) -> Result<Extraction, ffmpeg_next::Error> {
        match self.packet_iter.next() {
            Some((_, packet)) => {
                let stream_index = self.streams[self.index];
                if let Some(audio) = self.audio.as_mut()
                    && stream_index == audio.stream_index()
                {
                    audio.send_packet(&packet)?;
                    while let Ok(frame) = audio.extract_next_frame() {
                        self.audio_frames.push_back(frame);
                    }
                } else if stream_index == self.video.stream_index() {
                    self.video.send_packet(&packet)?;
                    while let Ok(frame) = self.video.extract_next_frame() {
                        self.video_frames.push_back(frame);
                    }
                }
                self.index += 1;
                // There is a video frame.
                // There is an expected audio frame.
                let have_audio_frame = if self.audio.is_some() {
                    !self.audio_frames.is_empty()
                } else {
                    true
                };
                Ok(if !self.video_frames.is_empty() && have_audio_frame {
                    let video = self.video_frames.pop_front().unwrap();
                    let audio = self.audio_frames.pop_front().map(|a| {
                        let format = match a.format() {
                            Sample::U8(_) => Some(AudioFormat::U8),
                            Sample::I16(_) => Some(AudioFormat::I16),
                            Sample::I32(_) => Some(AudioFormat::I32),
                            Sample::I64(_) => Some(AudioFormat::I64),
                            Sample::F32(_) => Some(AudioFormat::F32),
                            Sample::F64(_) => Some(AudioFormat::F64),
                            Sample::None => None,
                        };
                        nodekit_rs_audio::AudioFrame {
                            buffer: a.data(0).to_vec(),
                            rate: a.rate(),
                            channels: a.channels(),
                            format
                        }
                    });
                    Extraction::Frame(Frame { video, audio })
                } else {
                    Extraction::NoFrame
                })
            }
            None => Ok(Extraction::EndOfVideo),
        }
    }

    /// Reset to loop the video.
    pub fn reset(&mut self) -> Result<(), ffmpeg_next::Error> {
        let input = input(&self.path)?;
        self.packet_iter = PacketIter::from(input);
        self.index = 0;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_video_extraction() {
        let mut extractor = FrameExtractor::new("../mp4.ia.mp4", 320, 180, false).unwrap();
        let mut num_frames = 0u64;
        while let Ok(frame) = extractor.get_next_frame()
            && !matches!(frame, Extraction::EndOfVideo)
        {
            num_frames += 1;
        }
        assert_eq!(num_frames, 1484);
    }
}
