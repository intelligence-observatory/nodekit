//! This crate provides the means of extracting frame data from a video.
//! It doesn't provide any blitting or processing functionality.

mod extractor;
mod frame;
mod packet_iter;
mod extraction;

use extractor::{AudioExtractor, VideoExtractor};
use ffmpeg_next::{
    format::input,
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame},
};
pub use extraction::Extraction;
pub use frame::Frame;
use std::{collections::VecDeque, path::Path};
use packet_iter::PacketIter;

/// Extract frames from a video.
/// This opens a video and keeps it open until `FrameExtractor` is dropped.
pub struct FrameExtractor<'f> {
    packet_iter: PacketIter<'f>,
    streams: Vec<usize>,
    /// None if the video doesn't have audio.
    audio: Option<AudioExtractor>,
    video: VideoExtractor,
    /// Pending video frames. The extractors can extract more than one frame.
    video_frames: VecDeque<VideoFrame>,
    /// Pending audio frames. The extractors can extract more than one frame.
    audio_frames: VecDeque<AudioFrame>,
    index: usize,
    num_packets: usize,
}

impl FrameExtractor<'_> {
    /// - `path` is the path to the video.
    /// - `width` and `height` are the dimensions that we want to scale each video frame to.
    pub fn new<P: AsRef<Path>>(
        path: P,
        width: u32,
        height: u32,
    ) -> Result<Self, ffmpeg_next::Error> {
        let mut input = input(path.as_ref())?;
        // Extract packets.
        let streams = input.packets().map(|(stream, _)| {
            stream.index()
        }).collect::<Vec<usize>>();
        let input = ffmpeg_next::format::input(path.as_ref())?;
        let num_packets = streams.len();
        let audio = AudioExtractor::new(&input).ok();
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
            num_packets
        })
    }

    /// Read packets and try to get a new frame.
    ///
    /// Returns an error if there was an underlying extraction error or if it's the end of the file.
    /// Returns None if there are no frames yet.
    pub fn get_next_frame(&mut self) -> Result<Extraction, ffmpeg_next::Error> {
        match self.packet_iter.next() {
            Some((_, packet)) => {
                if self.index < self.num_packets {
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
                        let audio = self.audio_frames.pop_front();
                        Extraction::Frame(Frame { video, audio })
                    } else {
                        Extraction::NoFrame
                    })
                }
                else {
                    Ok(Extraction::EndOfVideo)
                }
            }
            None => Ok(Extraction::EndOfVideo)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_video_extraction() {
        let mut extractor = FrameExtractor::new("../mp4.ia.mp4", 320, 180).unwrap();
        let mut num_frames = 0u64;
        while let Ok(frame) = extractor.get_next_frame() && !matches!(frame, Extraction::EndOfVideo) {
            num_frames += 1;
        }
        assert_eq!(num_frames, 1484);
    }
}
