use pyo3::prelude::*;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// An action that can be executed by an agent.
#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Clone)]
pub enum Action {
    /// Click at `(x, y)` where `x` and `y` are between -0.5 and 0.5
    Click { x: f32, y: f32 },
    /// Press a key.
    KeyPress(String),
    /// TODO
    Submit(),
}
