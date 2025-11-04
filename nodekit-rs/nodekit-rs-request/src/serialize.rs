use flatbuffers::FlatBufferBuilder;
use nodekit_rs_fb::{
    graph as graph_fb, key_press as key_press_fb, mouse as mouse_fb, noop as noop_fb,
};
use pyo3::exceptions::PyValueError;
use pyo3::{
    prelude::*,
    types::{PyBytes, PyString},
};
use pyo3_stub_gen::derive::gen_stub_pyfunction;

/// Returns a serialized no-op action.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn noop<'py>(py: Python<'py>) -> Bound<'py, PyBytes> {
    let mut fbb = FlatBufferBuilder::new();
    let n = noop_fb::Noop::create(&mut fbb, &noop_fb::NoopArgs {});
    noop_fb::finish_noop_buffer(&mut fbb, n);
    PyBytes::new(py, fbb.finished_data())
}

/// Returns a serialized `graph`, which must be of type `nk.Graph`.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn graph<'py>(py: Python<'py>, graph: &Bound<'py, PyAny>) -> PyResult<Bound<'py, PyBytes>> {
    // Assume that this is a valid Graph and try to dump the JSON string.
    let json = graph.getattr("model_dump_json")?.call0()?;
    // Serialize the JSON string into a Flatbuffer.
    let mut fbb = FlatBufferBuilder::new();
    let node_graph = fbb.create_vector(json.cast::<PyString>()?.to_str()?.as_bytes());
    let args = graph_fb::GraphArgs {
        node_graph: Some(node_graph),
    };
    let graph = graph_fb::Graph::create(&mut fbb, &args);
    graph_fb::finish_graph_buffer(&mut fbb, graph);
    Ok(PyBytes::new(py, fbb.finished_data()))
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
                Err(PyValueError::new_err("Invalid mouse delta: {delta}"))
            } else {
                let mut fbb = FlatBufferBuilder::new();
                let delta = mouse_fb::Vec2::new(delta.0, delta.1);
                let click = mouse_fb::Mouse::create(
                    &mut fbb,
                    &mouse_fb::MouseArgs {
                        delta: Some(&delta),
                        clicked,
                    },
                );
                mouse_fb::finish_mouse_buffer(&mut fbb, click);
                Ok(PyBytes::new(py, fbb.finished_data()))
            }
        }
        None => {
            let mut fbb = FlatBufferBuilder::new();
            let mouse = mouse_fb::Mouse::create(
                &mut fbb,
                &mouse_fb::MouseArgs {
                    delta: None,
                    clicked,
                },
            );
            mouse_fb::finish_mouse_buffer(&mut fbb, mouse);
            Ok(PyBytes::new(py, fbb.finished_data()))
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
    let mut fbb = FlatBufferBuilder::new();
    let key = fbb.create_string(key.to_str()?);
    let click =
        key_press_fb::KeyPress::create(&mut fbb, &key_press_fb::KeyPressArgs { key: Some(key) });
    key_press_fb::finish_key_press_buffer(&mut fbb, click);
    Ok(PyBytes::new(py, fbb.finished_data()))
}
