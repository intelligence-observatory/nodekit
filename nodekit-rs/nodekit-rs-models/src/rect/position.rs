use glam::DVec2;
use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass;

/// The position of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone)]
pub struct Position {
    /// The x coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    #[pyo3(get)]
    pub x: f64,
    /// The y coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    #[pyo3(get)]
    pub y: f64,
}

impl From<Position> for DVec2 {
    fn from(value: Position) -> Self {
        Self {
            x: value.x,
            y: value.y,
        }
    }
}
