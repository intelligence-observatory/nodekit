use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass;
use crate::Position;

#[pyclass]
#[gen_stub_pyclass]
#[derive(Clone)]
pub struct Pointer {
    pub position: Position,
    pub clicked: bool,
}