use crate::extract::audio_params::AudioParams;
use ffmpeg_next::format::Pixel;
use ffmpeg_next::{
    Error, Packet,
    codec::{
        context::Context,
        decoder::{Audio, Video},
    },
    format::context::Input,
    media::Type,
    software::scaling::{Context as ScalingContext, Flags},
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame},
};
use paste::paste;

macro_rules! inner_extractor {
    ($name:ident, $decoder:ident) => {
        paste! {
            /// Extract frames from a stream.
            struct [<Inner $name Extractor>] {
                /// The index of this stream in the video file.
                stream_index: usize,
                decoder: $name,
                frame: [<$name Frame>],
            }

            impl [<Inner $name Extractor>] {
                pub fn new(input: &Input) -> Result<Self, Error> {
                    let stream = input
                        .streams()
                        .best(Type::$name)
                        .ok_or(Error::StreamNotFound)?;
                    let stream_index = stream.index();
                    let context_decoder = Context::from_parameters(stream.parameters())?;
                    let decoder = context_decoder.decoder().$decoder()?;
                    Ok(Self {
                        stream_index,
                        decoder,
                        frame: [<$name Frame>]::empty()
                    })
                }

                pub fn send_packet(&mut self, packet: &Packet) -> Result<(), Error> {
                     self.decoder.send_packet(packet)
                }

                pub fn extract_next_frame(&mut self) -> Result<&[u8], Error> {
                    self.decoder.receive_frame(&mut self.frame)?;
                    Ok(self.frame.data(0))
                }
            }
        }
    };
}

inner_extractor!(Audio, audio);
inner_extractor!(Video, video);

macro_rules! outer_extractor {
    ($name: ident) => {
        impl $name {
            pub fn send_packet(&mut self, packet: &Packet) -> Result<(), Error> {
                self.extractor.send_packet(packet)
            }

            pub fn stream_index(&self) -> usize {
                self.extractor.stream_index
            }
        }
    };
}

/// Extract per-frame chunks of audio from a video.
pub struct AudioExtractor {
    extractor: InnerAudioExtractor,
}

impl AudioExtractor {
    pub fn new(input: &Input) -> Result<Self, Error> {
        let extractor = InnerAudioExtractor::new(input)?;
        Ok(Self { extractor })
    }

    /// Receive the next frame in the stream.
    /// Returns an error if there are no more frames.
    pub fn extract_next_frame(&mut self) -> Result<&[u8], Error> {
        self.extractor.extract_next_frame()
    }

    pub fn get_params(&self) -> AudioParams {
        AudioParams::new(&self.extractor.decoder)
    }
}

/// Extract video frames.
pub struct VideoExtractor {
    extractor: InnerVideoExtractor,
    scaler: ScalingContext,
    frame: VideoFrame,
}

impl VideoExtractor {
    pub fn new(input: &Input, width: u32, height: u32) -> Result<Self, Error> {
        let extractor = InnerVideoExtractor::new(input)?;
        let scaler = ScalingContext::get(
            extractor.decoder.format(),
            extractor.decoder.width(),
            extractor.decoder.height(),
            Pixel::RGB24,
            width,
            height,
            Flags::BILINEAR,
        )?;
        Ok(Self {
            extractor,
            scaler,
            frame: VideoFrame::empty(),
        })
    }

    /// Receive the next frame in the stream.
    /// Returns an error if there are no more frames.
    pub fn extract_next_frame(&mut self) -> Result<&[u8], Error> {
        self.extractor.extract_next_frame()?;
        // Scale the frame.
        self.scaler.run(&self.extractor.frame, &mut self.frame)?;
        Ok(self.frame.data(0))
    }
}

outer_extractor!(AudioExtractor);
outer_extractor!(VideoExtractor);
