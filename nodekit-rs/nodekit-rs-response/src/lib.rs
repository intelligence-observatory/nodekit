//! The [`Response`] is sent from the simulator to the Python client.
//!
//! The [`VisualFrame`] and [`AudioFrame`] structs are used as fields of [`Response`],
//! and elsewhere in `nodekit-rs`, particularly when blitting images or extracting video frames.

mod audio;
mod error;
mod visual;

pub use audio::*;
use bincode::{config::Configuration, Decode, Encode, decode_from_slice, encode_to_vec};
pub use error::Error;
use pyo3::exceptions::PyTypeError;
use pyo3::prelude::*;
use pyo3::types::PyBytes;
use pyo3_stub_gen::derive::*;
pub use visual::*;

#[gen_stub_pyclass]
#[pyclass]
#[derive(Default, Decode, Encode)]
pub struct Response {
    /// The visual frame.
    /// If None, the visual frame didn't update.
    #[pyo3(get)]
    pub visual: Option<VisualFrame>,
    /// The audio frame.
    /// If None, the audio frame either didn't update or there is no audio.
    #[pyo3(get)]
    pub audio: Option<AudioFrame>,
    /// If not None, this is the ID of the sensor triggered the end of the node.
    #[pyo3(get)]
    pub sensor: Option<String>,
    /// If true, the current node finished on this frame.
    #[pyo3(get)]
    pub finished: bool,
    /// The nodekit version.
    #[pyo3(get)]
    pub version: String,
}

impl Response {
    pub const fn finished(version: String) -> Self {
        Self {
            visual: None,
            audio: None,
            sensor: None,
            finished: true,
            version,
        }
    }
}

impl Response {
    pub fn serialize(&self) -> Result<Vec<u8>, Error> {
        encode_to_vec::<&Self, Configuration>(self, Configuration::default()).map_err(Error::Encode)
    }
}

#[gen_stub_pymethods]
#[pymethods]
impl Response {
    /// Deserialize a `Response`.
    #[new]
    pub fn deserialize(buffer: &Bound<'_, PyBytes>) -> PyResult<Self> {
        decode_from_slice::<Self, Configuration>(buffer.as_bytes(), Configuration::default())
            .map(|d| d.0)
            .map_err(|error| PyTypeError::new_err(error.to_string()))
    }
}
