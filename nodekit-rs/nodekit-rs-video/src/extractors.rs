use ffmpeg_next::{
    Error, Packet,
    codec::{
        context::Context,
        decoder::{Audio, Video},
    },
    format::{Pixel, context::Input},
    media::Type,
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame},
};

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

macro_rules! extract {
    ($self:ident, $packet:ident, $frame:ident) => {{
        $self.decoder.send_packet($packet)?;
        $self.decoder.receive_frame(&mut $self.frame)?;
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
        extract!(self, packet, AudioFrame);
        Ok(())
    }
}

/// Extract video frames from a stream.
pub struct VideoExtractor {
    pub stream_index: usize,
    pub frame: VideoFrame,
    decoder: Video,
}

impl VideoExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Video, video);
        let frame = VideoFrame::new(decoder.format(), decoder.width(), decoder.height());
        Ok(Self {
            stream_index,
            decoder,
            frame,
        })
    }

    pub fn get_target_frame(&self, time_msec: f64) -> usize {
        ((time_msec / 1000.) * f64::from(self.decoder.frame_rate().unwrap().invert())) as usize
    }

    /// Send the pack and try to get the next frame.
    pub fn try_extract_frame(&mut self, packet: &Packet) -> Result<(), Error> {
        extract!(self, packet, VideoFrame);
        self.frame.set_format(Pixel::RGB24);
        Ok(())
    }
}
