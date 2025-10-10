use ffmpeg_next::{
    Error,
    media::Type,
    codec::{context::Context, decoder::{Audio, Video}},
    format::context::Input,
    util::frame::{audio::Audio as AudioFrame, video::Video as VideoFrame}
};
use paste::paste;

macro_rules! extractor {
    ($name:ident, $decoder:ident) => {
        paste! {
            /// Extract frames from a stream.
            pub struct [<$name Extractor>] {
                /// The index of this stream in the video file.
                pub stream_index: usize,
                decoder: $name,
                frame: [<$name Frame>]
            }
            
            impl [<$name Extractor>] {
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
                
                /// Receive the next frame in the stream.
                /// Returns an error if there are no more frames.
                pub fn receive_frame(&mut self) -> Result<&[u8], Error> {
                    self.decoder.receive_frame(&mut self.frame)?;
                    Ok(self.frame.data(0))
                }
            }
        }
    };
}

extractor!(Audio, audio);
extractor!(Video, video);

pub fn extract()