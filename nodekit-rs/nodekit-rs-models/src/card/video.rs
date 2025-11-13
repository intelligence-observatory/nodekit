use std::path::PathBuf;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use super::Card;

/// A .mp4 file.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Video {
    /// The path of the source file.
    #[pyo3(get)]
    pub path: PathBuf,
    /// If true, the video will be muted.
    #[pyo3(get)]
    pub muted: bool,
    /// If true, the video will play in a loop.
    #[pyo3(get)]
    pub looped: bool,
}

#[gen_stub_pymethods]
#[pymethods]
impl Video {
    #[new]
    pub fn new(path: PathBuf, muted: bool, looped: bool) -> Self {
        Self {
            path,
            muted,
            looped
        }
    }
}