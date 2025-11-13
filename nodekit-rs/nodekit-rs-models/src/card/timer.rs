use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};

/// The start and end time of a card.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Copy, Clone)]
pub struct Timer {
    /// The card is visible at this time onward, in milliseconds.
    pub start_msec: u64,
    /// The card is hidden at this time onward, in milliseconds.
    pub end_msec: Option<u64>,
}

#[gen_stub_pymethods]
#[pymethods]
impl Timer {
    #[new]
    #[pyo3(signature = (start_msec, end_msec=None, /), text_signature = None)]
    pub fn new(start_msec: u64, end_msec: Option<u64>) -> Self {
        Self {
            start_msec,
            end_msec,
        }
    }
}
