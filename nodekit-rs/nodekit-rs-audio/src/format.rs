use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// `AudioFrame` returns a raw byte array of wav data (`buffer`).
/// Use this enum, plus numpy, to read `buffer` as the correct dtype.
#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Clone, Debug)]
pub enum Format {
    U8,
    I16,
    I32,
    I64,
    F32,
    F64,
}