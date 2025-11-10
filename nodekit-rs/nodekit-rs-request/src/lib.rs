//! This crate contains the [`Request`] that the Python client sends to the simulator
//! (as a serialized byte array).
//!
//! The [`serialize`] functions are Python-facing.
//! The [`Request`] struct isn't Python-facing because there's never a need to use it there.

mod action;
mod error;
pub mod serialize;

pub use action::Action;
pub use error::Error;
use nodekit_rs_graph::Graph;
use bincode::config::Configuration;
use bincode::serde::{decode_from_slice, encode_to_vec};
use pyo3::exceptions::PyTypeError;
use pyo3::prelude::*;
use pyo3::types::PyBytes;
use serde::{Deserialize, Serialize};

/// A deserialized sent from Python to the simulator.
#[derive(Deserialize, Serialize)]
pub enum Request {
    /// Reset the simulator (set `state` to None).
    Reset,
    /// A deserialized `Graph`.
    Graph(Graph),
    /// Tell the simulator to advance by one tick.
    /// Optionally, send an action as well.
    Tick(Option<Action>),
}

impl Request {
    pub fn deserialize(buffer: &[u8]) -> Result<Self, Error> {
        decode_from_slice::<Self, Configuration>(buffer, Configuration::default()).map(|d| d.0).map_err(Error::Decode)
    }

    pub(crate) fn serialize<'py>(&self, py: Python<'py>) -> PyResult<Bound<'py, PyBytes>>{
        encode_to_vec::<&Self, Configuration>(self, Configuration::default()).map(|r| PyBytes::new(py, &r)).map_err(|e| PyTypeError::new_err(e.to_string()))
    }
}

impl From<Action> for Request {
    fn from(value: Action) -> Self {
        Self::Tick(Some(value))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_noop() {
        let noop = encode_to_vec::<Request, Configuration>(Request::Tick(None), Configuration::default()).unwrap();
        Request::deserialize(&noop).unwrap();
    }
}
