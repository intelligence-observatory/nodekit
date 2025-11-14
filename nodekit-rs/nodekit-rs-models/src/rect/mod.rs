mod position;
mod size;

use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};

pub use position::Position;
pub use size::Size;

/// The position and size of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone)]
pub struct Rect {
    #[pyo3(get)]
    pub position: Position,
    #[pyo3(get)]
    pub size: Size,
}

#[gen_stub_pymethods]
#[pymethods]
impl Rect {
    #[new]
    pub fn new(x: f64, y: f64, w: f64, h: f64) -> Self {
        Self {
            position: Position { x, y },
            size: Size { w, h },
        }
    }
}
