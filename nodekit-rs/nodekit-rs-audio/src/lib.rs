use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass;

mod format;

pub use format::Format;

/// A frame of audio data.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone, Debug)]
pub struct AudioFrame {
    /// Raw wav data.
    #[pyo3(get)]
    pub buffer: Vec<u8>,
    /// The sample rate, e.g. 44100
    #[pyo3(get)]
    pub rate: u32,
    /// The number of audio channels, e.g. 2
    #[pyo3(get)]
    pub channels: u16,
    /// Use numpy to read `buffer` as this format.
    #[pyo3(get)]
    pub format: Option<Format>,
}
