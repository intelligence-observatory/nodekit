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
    ($self:ident, $name:ident) => {{
        let mut frame = $name::empty();
        $self.decoder.receive_frame(&mut frame)?;
        frame
    }};
}

macro_rules! fns {
    ($name:ident, $decoder:ident) => {
        pub fn send_packet(&mut self, packet: &Packet) -> Result<(), Error> {
            self.decoder.send_packet(packet)
        }

        pub const fn stream_index(&self) -> usize {
            self.stream_index
        }
    };
}

/// Extract audio frames from a stream.
pub struct AudioExtractor {
    /// The index of this stream in the video file.
    stream_index: usize,
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

    pub fn extract_next_frame(&mut self) -> Result<AudioFrame, Error> {
        Ok(extract!(self, AudioFrame))
    }

    fns!(Audio, audio);
}

/// Extract video frames from a stream.
pub struct VideoExtractor {
    /// The index of this stream in the video file.
    stream_index: usize,
    decoder: Video,
    converter: ScalingContext,
}

impl VideoExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let (stream_index, decoder) = decoder!(input, Video, video);
        let scaler = ScalingContext::get(
            decoder.format(),
            decoder.width(),
            decoder.height(),
            Pixel::RGB24,
            decoder.width(),
            decoder.height(),
            Flags::FAST_BILINEAR,
        )?;
        Ok(Self {
            stream_index,
            decoder,
            converter: scaler,
        })
    }

    /// Receive the next frame in the stream.
    /// Returns an error if there are no more frames.
    pub fn extract_next_frame(&mut self) -> Result<VideoFrame, Error> {
        let frame = extract!(self, VideoFrame);
        // Convert to RGB24.
        let mut rgb_frame = VideoFrame::empty();
        self.converter.run(&frame, &mut rgb_frame)?;
        Ok(rgb_frame)
    }

    fns!(Video, video);
}
