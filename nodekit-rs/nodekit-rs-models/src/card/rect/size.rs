use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass;

/// The size of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone)]
pub struct Size {
    /// The width of the card. 0.0 to 1.0, with 1.0 being the width of the board.
    #[pyo3(get)]
    pub w: f64,
    /// The height of the card. 0.0 to 1.0, with 1.0 being the height of the board.
    #[pyo3(get)]
    pub h: f64,
}
