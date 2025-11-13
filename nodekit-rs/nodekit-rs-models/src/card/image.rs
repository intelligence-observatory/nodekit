use pyo3::prelude::*;
use pyo3_stub_gen::derive::gen_stub_pyclass;
use std::path::PathBuf;

/// A .png file.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Image {
    /// The path of the source file.
    #[pyo3(get)]
    pub path: PathBuf,
}
