use flatbuffers::FlatBufferBuilder;
use nodekit_rs_fb::{
    click as click_fb, graph as graph_fb, key_press as key_press_fb, noop as noop_fb,
};
use pyo3::{
    prelude::*,
    types::{PyBytes, PyString},
};
use pyo3_stub_gen::derive::gen_stub_pyfunction;

/// Returns a serialized no-op tick.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn noop<'py>(py: Python<'py>) -> Bound<'py, PyBytes> {
    let mut fbb = FlatBufferBuilder::new();
    let n = noop_fb::Noop::create(&mut fbb, &noop_fb::NoopArgs {});
    noop_fb::finish_noop_buffer(&mut fbb, n);
    PyBytes::new(py, fbb.finished_data())
}

/// Returns a serialized graph.
/// The `graph` must be of type `nodekit.Graph`
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

/// Returns a serialized tick with a click action.
#[gen_stub_pyfunction]
#[pyfunction]
pub fn click<'py>(py: Python<'py>, x: f64, y: f64) -> Bound<'py, PyBytes> {
    let mut fbb = FlatBufferBuilder::new();
    let click = click_fb::Click::create(&mut fbb, &click_fb::ClickArgs { x, y });
    click_fb::finish_click_buffer(&mut fbb, click);
    PyBytes::new(py, fbb.finished_data())
}

/// Returns a serialized tick with a key press action.
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
