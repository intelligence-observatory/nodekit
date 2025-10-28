use pyo3::pyclass;
use crate::AudioFormat;

#[pyclass]
#[derive(Clone, Debug)]
pub struct Audio {
    pub frame: Vec<u8>,
    pub rate: u32,
    pub channels: u16,
    pub format: AudioFormat,
}
