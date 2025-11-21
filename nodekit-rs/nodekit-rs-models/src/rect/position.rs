use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use std::fmt::{Display, Formatter};

/// The position of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone, Default, Debug)]
pub struct Position {
    /// The x coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    #[pyo3(get)]
    pub x: f64,
    /// The y coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    #[pyo3(get)]
    pub y: f64,
}

#[gen_stub_pymethods]
#[pymethods]
impl Position {
    #[new]
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
}

impl Display for Position {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{{x: {}, y: {}}}", self.x, self.y)
    }
}
