use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;
use super::{Image, Text, Video};

/// Defines what the card renders.
#[gen_stub_pyclass_enum]
#[pyclass]
pub enum CardType {
    Image(Image),
    Text(Text),
    Video(Video),
}
