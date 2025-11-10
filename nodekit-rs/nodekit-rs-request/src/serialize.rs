use glam::DVec2;
use pyo3::exceptions::{PyRuntimeError, PyValueError};
use pyo3::{
    prelude::*,
    types::{PyBytes, PyString},
};
use pyo3_stub_gen::derive::gen_stub_pyfunction;
use serde_json::from_str;
use nodekit_rs_graph::Graph;
use crate::{Action, Request};

/// Returns a serialized no-op action.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn noop<'py>(py: Python<'py>) -> PyResult<Bound<'py, PyBytes>> {
    Request::Tick(None).serialize(py)
}

/// Returns a serialized `graph`, which must be of type `nk.Graph`.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn graph<'py>(py: Python<'py>, graph: &Bound<'py, PyAny>) -> PyResult<Bound<'py, PyBytes>> {
    // Assume that this is a valid Graph and try to dump the JSON string.
    let json = graph.getattr("model_dump_json")?.call0()?;
    let graph = from_str::<Graph>(json.cast::<PyString>()?.to_str()?).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
    Request::Graph(graph).serialize(py)
}

/// Returns a serialized mouse action.
///
/// `delta` is a tuple of (x, y) coordinates that describe the delta of the mouse position.
/// The coordinates must be between -0.5 and 0.5.
/// If None, the mouse didn't move.
/// Note! This function *doesn't* attempt to clamp `delta` to realistic values.
///
/// If `clicked` is true, there was a mouse click on this frame.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn mouse<'py>(
    py: Python<'py>,
    delta: Option<(f64, f64)>,
    clicked: bool,
) -> PyResult<Bound<'py, PyBytes>> {
    match delta {
        Some(delta) => {
            if delta.0 < -0.5 || delta.0 > 0.5 || delta.1 < -0.5 || delta.1 > 0.5 {
                Err(PyValueError::new_err(format!(
                    "Invalid mouse delta: {:?}",
                    delta
                )))
            } else {
                Request::from(Action::Mouse {
                    delta: Some(DVec2::new(delta.0, delta.1)),
                    clicked,
                }).serialize(py)
            }
        }
        None => {
            Request::from(Action::Mouse {
                delta: None,
                clicked
            }).serialize(py)
        }
    }
}

/// Returns a serialized key press action.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn key_press<'py>(
    py: Python<'py>,
    key: &Bound<'py, PyString>,
) -> PyResult<Bound<'py, PyBytes>> {
    Request::from(Action::KeyPress(key.to_string())).serialize(py)
}

/// Returns a serialized command to reset the simulator.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn reset<'py>(py: Python<'py>) -> PyResult<Bound<'py, PyBytes>> {
    Request::Reset.serialize(py)
}
