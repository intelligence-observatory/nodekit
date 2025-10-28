use ffmpeg_next::{
    Error, Packet,
    codec::{
        context::Context,
        decoder::{Audio, Video},
    },
    format::{Pixel, context::Input},
    media::Type,
    software::converter,
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame},
};
use ffmpeg_next::format::Sample;
use nodekit_rs_audio::Format;

macro_rules! decoder {
    ($input:ident, $name:ident, $decoder:ident) => {{
        let stream = $input
            .streams()
            .best(Type::$name)
            .ok_or(Error::StreamNotFound)?;
        let stream_index = stream.index();
        let context_decoder = Context::from_parameters(stream.parameters())?;
        (stream_index, context_decoder.decoder().$decoder()?)
    }};
}

/// Extract audio frames from a stream.
pub struct AudioExtractor {
    pub stream_index: usize,
    pub frame: AudioFrame,
    decoder: Audio,
}

impl AudioExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Audio, audio);
        Ok(Self {
            stream_index,
            decoder,
            frame: AudioFrame::empty(),
        })
    }

    /// Send the pack and try to get the next frame.
    pub fn try_extract_frame(&mut self, packet: &Packet) -> Result<(), Error> {
        self.decoder.send_packet(packet)?;
        self.decoder.receive_frame(&mut self.frame)
    }

    pub fn rate(&self) -> u32 {
        self.decoder.rate()
    }

    pub fn channels(&self) -> u16 {
        self.decoder.channels()
    }

    pub fn format(&self) -> Option<Format> {
        match self.decoder.format() {
            Sample::U8(_) => Some(Format::U8),
            Sample::I16(_) => Some(Format::I16),
            Sample::I32(_) => Some(Format::I32),
            Sample::I64(_) => Some(Format::I64),
            Sample::F32(_) => Some(Format::F32),
            Sample::F64(_) => Some(Format::F64),
            Sample::None => None
        }
    }
}

/// Extract video frames from a stream.
pub struct VideoExtractor {
    pub stream_index: usize,
    decoder: Video,
    decoded_frame: VideoFrame,
}

impl VideoExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Video, video);
        let decoded_frame = VideoFrame::new(decoder.format(), decoder.width(), decoder.height());
        Ok(Self {
            stream_index,
            decoder,
            decoded_frame,
        })
    }

    pub fn get_target_frame(&self, time_msec: u64) -> usize {
        ((time_msec as f64 / 1000.) * f64::from(self.decoder.frame_rate().unwrap()).ceil()) as usize
    }

    /// Send the pack and try to get the next frame.
    pub fn try_extract_frame(&mut self, packet: &Packet) -> Result<(), Error> {
        self.decoder.send_packet(packet)?;
        self.decoder.receive_frame(&mut self.decoded_frame)?;
        Ok(())
    }

    pub fn frame(&self) -> Result<VideoFrame, Error> {
        let mut frame = VideoFrame::new(Pixel::RGB24, self.decoder.width(), self.decoder.height());
        // Convert to RGB24.
        converter(
            (self.decoded_frame.width(), self.decoded_frame.height()),
            self.decoded_frame.format(),
            Pixel::RGB24,
        )?
        .run(&self.decoded_frame, &mut frame)?;
        Ok(frame)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ffmpeg_next::format::input;

    #[test]
    fn test_target_frame() {
        let input = input("../mp4.ia.mp4").unwrap();
        // Always get a video extractor.
        let video = VideoExtractor::new(&input).unwrap();
        assert_eq!(
            f64::from(video.decoder.frame_rate().unwrap()).ceil() as usize,
            30
        );
        assert_eq!(video.get_target_frame(0), 0);
        assert_eq!(video.get_target_frame(34), 1);
    }
}
