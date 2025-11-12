//! This crate contains the [`Request`] that the Python client sends to the simulator
//! (as a serialized byte array).
//!
//! The [`serialize`] functions are Python-facing.
//! The [`Request`] struct isn't Python-facing because there's never a need to use it there.

mod action;
pub mod serialize;

pub use action::Action;
use nodekit_rs_graph::Graph;
use pyo3::exceptions::PyTypeError;
use pyo3::prelude::*;
use pyo3::types::PyBytes;
use serde::{Deserialize, Serialize};
use serde_json::{from_slice, to_vec};

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
    pub fn deserialize(buffer: &[u8]) -> Result<Self, serde_json::Error> {
        from_slice(buffer)
    }

    pub(crate) fn serialize<'py>(&self, py: Python<'py>) -> PyResult<Bound<'py, PyBytes>> {
        to_vec(self)
            .map(|r| PyBytes::new(py, &r))
            .map_err(|e| PyTypeError::new_err(e.to_string()))
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
        let noop = to_vec(&Request::Tick(None)).unwrap();
        Request::deserialize(&noop).unwrap();
    }
}
