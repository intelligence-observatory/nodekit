use std::path::PathBuf;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};

/// A .png file.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Image {
    /// The path of the source file.
    #[pyo3(get)]
    pub path: PathBuf,
}

#[gen_stub_pymethods]
#[pymethods]
impl Image {
    #[new]
    pub fn new(path: PathBuf) -> Self {
        Self {
            path
        }
    }
}