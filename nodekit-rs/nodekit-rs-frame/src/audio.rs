use bytemuck::cast_slice;
use dasp_sample::conv;
use nodekit_rs_video::{Audio, AudioFormat, AudioRate};
use paste::paste;

macro_rules! convert {
    ($audio:ident, $from:tt) => {
        paste! {{
            let casted = cast_slice::<u8, $from>(&$audio.frame);

            fn double(casted: &[$from]) -> Vec<f32> {
                casted
                .iter()
                .flat_map(|s| {
                    let s = conv::[<$from>]::to_f32(*s);
                    [s, s]
                })
                .collect()
            }

            fn quadruple(casted: &[$from]) -> Vec<f32> {
                casted
                .iter()
                .flat_map(|s| {
                    let s = conv::[<$from>]::to_f32(*s);
                    [s, s, s, s]
                })
                .collect()
            }

            match ($audio.channels, $audio.rate) {
                (2, AudioRate::Standard) => {
                    casted
                    .iter()
                    .map(|s| {
                        conv::[<$from>]::to_f32(*s)
                    })
                    .collect()
                },
                (1, AudioRate::Standard) => double(casted),
                (other, AudioRate::Standard) => {
                    casted
                    .chunks_exact(other as usize)
                    .flat_map(|chunk| {
                        [
                            conv::[<$from>]::to_f32(chunk[0]),
                            conv::[<$from>]::to_f32(chunk[1]),
                        ]
                    })
                    .collect()
                },
                (2, AudioRate::Half) => double(casted),
                (1, AudioRate::Half) => quadruple(casted),
                (other, AudioRate::Half) => {
                    casted
                    .chunks_exact(other as usize)
                    .flat_map(|chunk| {
                        let a = conv::[<$from>]::to_f32(chunk[0]);
                        let b = conv::[<$from>]::to_f32(chunk[1]);
                        [a, a, b, b]
                    })
                    .collect()
                }
                (2, AudioRate::Quarter) => quadruple(casted),
                (1, AudioRate::Quarter) => {
                    casted
                    .iter()
                    .flat_map(|s| {
                        let s = conv::[<$from>]::to_f32(*s);
                        [s, s, s, s, s, s, s, s]
                    })
                    .collect()
                }
                (other, AudioRate::Quarter) => {
                    casted
                    .chunks_exact(other as usize)
                    .flat_map(|chunk| {
                        let a = conv::[<$from>]::to_f32(chunk[0]);
                        let b = conv::[<$from>]::to_f32(chunk[1]);
                        [a, a, a, a, b, b, b, b]
                    })
                    .collect()
                }
            }
        }}
    };
}

#[derive(Default)]
pub struct AudioBuilder(Vec<f32>);

impl AudioBuilder {
    /// Convert an arbitrary chunk of audio into a chunk of audio that:
    ///
    /// - Has a rate of 44100
    /// - Has two channels
    /// - Is f32s
    pub fn convert(audio: &Audio) -> Vec<f32> {
        match audio.format {
            AudioFormat::U8 => convert!(audio, u8),
            AudioFormat::I16 => convert!(audio, i16),
            AudioFormat::I32 => convert!(audio, i32),
            AudioFormat::I64 => convert!(audio, i64),
            AudioFormat::F32 => Self::convert_f32(audio),
            AudioFormat::F64 => convert!(audio, f64),
            AudioFormat::None => Vec::default(),
        }
    }

    fn convert_f32(audio: &Audio) -> Vec<f32> {
        fn double(casted: &[f32]) -> Vec<f32> {
            casted
                .iter()
                .flat_map(|s| {
                    let s = *s;
                    [s, s]
                })
                .collect()
        }

        fn quadruple(casted: &[f32]) -> Vec<f32> {
            casted
                .iter()
                .flat_map(|s| {
                    let s = *s;
                    [s, s, s, s]
                })
                .collect()
        }

        let casted = cast_slice::<u8, f32>(&audio.frame);
        match (audio.channels, audio.rate) {
            (2, AudioRate::Standard) => casted.to_vec(),
            (1, AudioRate::Standard) => double(casted),
            (other, AudioRate::Standard) => casted
                .chunks_exact(other as usize)
                .flat_map(|s| [s[0], s[1]])
                .collect(),
            (2, AudioRate::Half) => double(casted),
            (1, AudioRate::Half) => quadruple(casted),
            (other, AudioRate::Half) => casted
                .chunks_exact(other as usize)
                .flat_map(|chunk| [chunk[0], chunk[0], chunk[0], chunk[1]])
                .collect(),
            (2, AudioRate::Quarter) => quadruple(casted),
            (1, AudioRate::Quarter) => casted
                .iter()
                .flat_map(|s| {
                    let s = *s;
                    [s, s, s, s, s, s, s, s]
                })
                .collect(),
            (other, AudioRate::Quarter) => casted
                .chunks_exact(other as usize)
                .flat_map(|chunk| {
                    [
                        chunk[0], chunk[0], chunk[0], chunk[0], chunk[1], chunk[1], chunk[1],
                        chunk[1],
                    ]
                })
                .collect(),
        }
    }

    /// Overlay onto existing audio.
    pub fn overlay(&mut self, frame: Vec<f32>) {
        self.0
            .iter_mut()
            .zip(frame)
            .for_each(|(dst, src)| *dst = (*dst + src).clamp(-1., 1.));
    }

    pub fn finish(self) -> Vec<f32> {
        self.0
    }
}
