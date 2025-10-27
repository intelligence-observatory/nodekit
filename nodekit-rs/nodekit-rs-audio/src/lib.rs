mod error;
mod format;
mod rate;
mod size_multiplier;
mod src_channels;

use bytemuck::{Pod, cast_slice, cast_slice_mut};
pub use error::Error;
pub use format::Format;
pub use rate::Rate;
use size_multiplier::SizeMultiplier;
pub use src_channels::SrcChannels;

macro_rules! add {
    ($f:ident, $src:ident, $dst:expr, $rate:ident, $multiplier:ident, $format:ident) => {{
        match $format {
            Format::U8 => {
                Self::$f::<u8>($src, $dst, $rate, $multiplier.src_channels, Self::from_u8);
            }
            Format::I16 => {
                Self::$f::<i16>($src, $dst, $rate, $multiplier.src_channels, Self::from_i16);
            }
            Format::I32 => {
                Self::$f::<i32>($src, $dst, $rate, $multiplier.src_channels, Self::from_i32);
            }
            Format::I64 => {
                Self::$f::<i64>($src, $dst, $rate, $multiplier.src_channels, Self::from_i64);
            }
            Format::F32 => {
                Self::$f::<f32>($src, $dst, $rate, $multiplier.src_channels, Self::from_f32);
            }
            Format::F64 => {
                Self::$f::<f64>($src, $dst, $rate, $multiplier.src_channels, Self::from_f64);
            }
            Format::None => {
                return Err(Error::NoFormat);
            }
        }
    }};
}

#[derive(Default)]
pub struct AudioBuilder(Option<Vec<f32>>);

impl AudioBuilder {
    /// Convert audio to a standard format and then overlay it onto existing audio.
    ///
    /// - `src` is the wav byte data.
    /// - `rate` is the sample rate of `src`.
    /// - `channels` is the number of channels in `src`.
    /// - `format` is the sample format of `src`.
    pub fn add(
        &mut self,
        src: Vec<u8>,
        rate: Rate,
        channels: u16,
        format: Format,
    ) -> Result<(), Error> {
        let size_multiplier = SizeMultiplier::new(rate, channels as usize)?;
        let dst_len = src.len() * size_multiplier.multiplier;
        match self.0.as_mut() {
            Some(dst) => {
                let a_len = dst.len();
                if a_len < dst_len {
                    dst.append(&mut vec![0.; dst_len - a_len]);
                    dst.append(&mut vec![0.; dst_len - a_len]);
                }
                add!(overlay, src, dst, rate, size_multiplier, format);
            }
            None => {
                let mut dst = vec![0.; dst_len];
                add!(set, src, &mut dst, rate, size_multiplier, format);
                self.0 = Some(dst);
            }
        }
        Ok(())
    }

    /// Consume myself and return the audio buffer.
    pub fn finish(self) -> Option<Vec<f32>> {
        self.0
    }

    /// Set each value in `dst`.
    fn set<T: Pod + Sized>(src: Vec<u8>, dst: &mut [f32], rate: Rate, src_channels: SrcChannels, f: fn(T) -> f32) {
        match (src_channels, rate) {
            (_, Rate::FourEightZero) => todo!("48000"),
            (SrcChannels::One, Rate::Standard) => cast_slice::<u8, T>(&src)
                .to_vec()
                .into_iter()
                .zip(cast_slice_mut::<f32, [f32; 2]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(src);
                    dst[0] = s;
                    dst[1] = s;
                }),
            (SrcChannels::One, Rate::Half) => cast_slice::<u8, T>(&src)
                .to_vec()
                .into_iter()
                .zip(cast_slice_mut::<f32, [f32; 4]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(src);
                    dst[0] = s;
                    dst[1] = s;
                    dst[2] = s;
                    dst[3] = s;
                }),
            (SrcChannels::One, Rate::Quarter) => cast_slice::<u8, T>(&src)
                .to_vec()
                .into_iter()
                .zip(cast_slice_mut::<f32, [f32; 8]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(src);
                    dst[0] = s;
                    dst[1] = s;
                    dst[2] = s;
                    dst[3] = s;
                    dst[4] = s;
                    dst[5] = s;
                    dst[6] = s;
                    dst[7] = s;
                }),
            (SrcChannels::Two, Rate::Standard) => cast_slice::<u8, T>(&src)
                .iter()
                .zip(dst.iter_mut())
                .for_each(|(src, dst)| {
                    *dst = *dst + f(*src);
                }),
            (SrcChannels::Two, Rate::Half) => cast_slice::<u8, T>(&src)
                .iter()
                .zip(cast_slice_mut::<f32, [f32; 2]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(*src);
                    dst[0] = s;
                    dst[1] = s;
                }),
            (SrcChannels::Two, Rate::Quarter) => cast_slice::<u8, T>(&src)
                .iter()
                .zip(cast_slice_mut::<f32, [f32; 4]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(*src);
                    dst[0] = s;
                    dst[1] = s;
                    dst[2] = s;
                    dst[3] = s;
                }),
            (SrcChannels::More(size), Rate::Standard) => cast_slice::<u8, T>(&src)
                .chunks_exact(size)
                .zip(cast_slice_mut::<f32, [f32; 2]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    dst[0] = f(src[0]);
                    dst[1] = f(src[1]);
                }),
            (SrcChannels::More(size), Rate::Half) => cast_slice::<u8, T>(&src)
                .chunks_exact(size)
                .zip(cast_slice_mut::<f32, [f32; 4]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    dst[0] = f(src[0]);
                    dst[1] = f(src[0]);
                    dst[2] = f(src[1]);
                    dst[3] = f(src[1]);
                }),
            (SrcChannels::More(size), Rate::Quarter) => cast_slice::<u8, T>(&src)
                .chunks_exact(size)
                .zip(cast_slice_mut::<f32, [f32; 8]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    dst[0] = f(src[0]);
                    dst[1] = f(src[0]);
                    dst[2] = f(src[0]);
                    dst[3] = f(src[0]);
                    dst[4] = f(src[1]);
                    dst[5] = f(src[1]);
                    dst[6] = f(src[1]);
                    dst[7] = f(src[1]);
                }),
        }
    }

    /// Add values in `src` to corresponding values in `dst`.
    /// Then clamp the result.
    fn overlay<T: Pod>(src: Vec<u8>, dst: &mut [f32], rate: Rate, src_channels: SrcChannels, f: fn(T) -> f32) {
        match (src_channels, rate) {
            (_, Rate::FourEightZero) => todo!("48000"),
            (SrcChannels::One, Rate::Standard) => cast_slice::<u8, T>(&src)
                .to_vec()
                .into_iter()
                .zip(cast_slice_mut::<f32, [f32; 2]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    let s = f(src);
                    dst[0] = (dst[0] + s).clamp(0., 1.);
                    dst[1] = (dst[1] + s).clamp(0., 1.);
                }),
            SrcChannels::Two => cast_slice::<u8, T>(&src)
                .iter()
                .zip(dst.iter_mut())
                .for_each(|(src, dst)| {
                    *dst = (*dst + f(*src)).clamp(0., 1.);
                }),
            SrcChannels::More(size) => cast_slice::<u8, T>(&src)
                .chunks_exact(size)
                .zip(cast_slice_mut::<f32, [f32; 2]>(dst).iter_mut())
                .for_each(|(src, dst)| {
                    dst[0] = (dst[0] + f(src[0])).clamp(0., 1.);
                    dst[1] = (dst[1] + f(src[1])).clamp(0., 1.);
                }),
        }
    }

    const fn from_u8(value: u8) -> f32 {
        value.cast_signed() as f32 / 128.
    }

    const fn from_i16(value: i16) -> f32 {
        value as f32 / 32768.
    }

    const fn from_i32(value: i32) -> f32 {
        value as f32 / 2147483648.
    }

    const fn from_i64(value: i64) -> f32 {
        value as f32 / 9_223_372_036_854_775_808.
    }

    const fn from_f32(value: f32) -> f32 {
        value
    }

    const fn from_f64(value: f64) -> f32 {
        value as f32
    }
}

#[cfg(test)]
mod tests {
    use hound::WavWriter;
    use super::*;

    #[test]
    fn test_convert_audio() {
        let mut builder = AudioBuilder::default();
        builder.add(include_bytes!("../test_files/a.wav")[44..].to_vec(), Rate::Quarter, 1, Format::I16).unwrap();
        // builder.add(include_bytes!("../test_files/b.wav")[44..].to_vec(), Rate::FourFourOne, 2, Format::F32).unwrap();
        assert!(builder.0.is_some());
        let spec = hound::WavSpec {
            channels: 2,
            sample_rate: 44100,
            bits_per_sample: 32,
            sample_format: hound::SampleFormat::Float,
        };
        let mut writer = WavWriter::create("test_files/out.wav", spec).unwrap();
        builder.finish().unwrap().into_iter().for_each(|s| writer.write_sample(s).unwrap());

    }
}