use pyo3::prelude::*;

#[cfg_attr(feature = "py", pyclass)]
#[derive(Clone)]
pub enum Action {
    Click { x: f32, y: f32 },
    KeyPress(String),
    Submit()
}