use glam::DVec2;
use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};

/// The position of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone, Default)]
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
        Self {
            x, y
        }
    }
}

impl From<Position> for DVec2 {
    fn from(value: Position) -> Self {
        Self {
            x: value.x,
            y: value.y,
        }
    }
}
