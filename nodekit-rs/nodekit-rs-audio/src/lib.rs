mod format;
mod rate;
mod error;
mod size_multiplier;
mod src_channels;

pub use error::Error;
pub use format::Format;
pub use rate::Rate;
pub use src_channels::SrcChannels;

#[derive(Default)]
pub struct AudioBuilder(Vec<f32>);

impl AudioBuilder {
    pub fn convert(src: &[u8], channels: u16, format: Format, rate: Rate, overlay: bool) {

    }

    fn convert_i16(src: &[u8], channels: u16, rate: Rate, overlay: bool) {

    }
}