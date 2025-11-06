use nodekit_rs_fb::response;
use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// The format of the samples in `AudioFrame.buffer`.
#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Clone, Debug)]
pub enum AudioFormat {
    U8,
    I16,
    I32,
    I64,
    F32,
    F64,
}

impl AudioFormat {
    pub const fn as_fb(&self) -> response::AudioFormat {
        match self {
            Self::U8 => response::AudioFormat::U8,
            Self::I16 => response::AudioFormat::I16,
            Self::I32 => response::AudioFormat::I32,
            Self::I64 => response::AudioFormat::I64,
            Self::F32 => response::AudioFormat::F32,
            Self::F64 => response::AudioFormat::F64,
        }
    }

    pub const fn from_fb(fb: response::AudioFormat) -> Option<Self> {
        match fb {
            response::AudioFormat::U8 => Some(AudioFormat::U8),
            response::AudioFormat::I16 => Some(AudioFormat::I16),
            response::AudioFormat::I32 => Some(AudioFormat::I32),
            response::AudioFormat::I64 => Some(AudioFormat::I64),
            response::AudioFormat::F32 => Some(AudioFormat::F32),
            response::AudioFormat::F64 => Some(AudioFormat::F64),
            _ => None,
        }
    }
}
