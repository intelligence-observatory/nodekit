mod position;
mod size;

use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use std::fmt::{Display, Formatter};

pub use position::Position;
pub use size::Size;

/// The position and size of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone, Debug)]
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

impl Rect {
    pub const fn overlaps(&self, value: &Self) -> bool {
        self.position.x < value.position.x + value.size.w
            && self.position.x + self.size.w > value.position.x
            && self.position.y > value.position.y + value.size.h
            && self.position.y + self.size.h < value.position.y
    }
}

impl Display for Rect {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {}", self.position, self.size)
    }
}
