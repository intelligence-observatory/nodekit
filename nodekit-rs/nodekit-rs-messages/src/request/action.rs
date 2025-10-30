use pyo3::prelude::*;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// An action that can be executed by an agent.
#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Clone)]
pub enum Action {
    Click { x: f32, y: f32 },
    KeyPress(String),
    Submit(),
}
