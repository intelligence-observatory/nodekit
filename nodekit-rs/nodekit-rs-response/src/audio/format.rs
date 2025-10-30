use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// The format of the samples in `AudioFrame.buffer`.
#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Clone, Debug)]
pub enum AudioFormat {
    U8,
    I16,
    I32,
    I64,
    F32,
    F64,
}