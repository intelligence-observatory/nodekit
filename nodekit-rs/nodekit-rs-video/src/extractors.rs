use ffmpeg_next::{
    Error, Packet,
    codec::{
        context::Context,
        decoder::{Audio, Video},
    },
    format::{Pixel, context::Input},
    media::Type,
    software::scaling::{Context as ScalingContext, Flags},
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
        let mut frame = $frame::empty();
        $self.decoder.receive_frame(&mut frame)?;
        frame
    }};
}

/// Extract audio frames from a stream.
pub struct AudioExtractor {
    pub stream_index: usize,
    decoder: Audio,
}

impl AudioExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Audio, audio);
        Ok(Self {
            stream_index,
            decoder,
        })
    }

    /// Send the pack and try to get the next frame.
    pub fn try_extract_frame(&mut self, packet: &Packet) -> Result<AudioFrame, Error> {
        Ok(extract!(self, packet, AudioFrame))
    }
}

/// Extract video frames from a stream.
pub struct VideoExtractor {
    pub stream_index: usize,
    decoder: Video,
    scaler: ScalingContext,
}

impl VideoExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Video, video);
        let width = decoder.width();
        let height = decoder.height();
        let scaler = ScalingContext::get(
            decoder.format(),
            width,
            height,
            Pixel::RGB24,
            width,
            height,
            Flags::BILINEAR,
        )?;
        Ok(Self {
            stream_index,
            decoder,
            scaler,
        })
    }

    /// Send the pack and try to get the next frame.
    pub fn try_extract_frame(&mut self, packet: &Packet) -> Result<VideoFrame, Error> {
        let mut frame = extract!(self, packet, VideoFrame);
        frame.set_format(Pixel::RGB24);
        Ok(frame)
    }
}