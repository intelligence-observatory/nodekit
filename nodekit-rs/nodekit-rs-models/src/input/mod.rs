mod pointer;

use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
pub use pointer::Pointer;
use crate::Position;

#[gen_stub_pyclass]
#[pyclass]
pub struct Input {
    pub key_press: Option<String>,
    pub pointer: Pointer,
}

#[gen_stub_pymethods]
#[pymethods]
impl Input {
    #[new]
    pub fn new(x: f64, y: f64, clicked: bool, key_press: Option<String>) -> Self {
        Self {
            key_press,
            pointer: Pointer {
                position: Position {
                    x,y
                },
                clicked
            }
        }
    }
}