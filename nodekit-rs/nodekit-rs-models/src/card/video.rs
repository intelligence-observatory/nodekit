use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use std::path::PathBuf;

/// A .mp4 file.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Video {
    /// The path of the source file.
    #[pyo3(get)]
    pub path: PathBuf,
    /// If true, the video will play in a loop.
    #[pyo3(get)]
    pub looped: bool,
    /// The time elapsed in the video.
    #[pyo3(get)]
    pub t_msec: u64,
}

#[gen_stub_pymethods]
#[pymethods]
impl Video {
    #[new]
    pub fn new(path: PathBuf, looped: bool) -> Self {
        Self {
            path,
            looped,
            t_msec: 0,
        }
    }
}
