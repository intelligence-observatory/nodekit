use super::{Image, Text, Video};
use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

/// Defines what the card renders.
#[gen_stub_pyclass_enum]
#[pyclass]
pub enum CardType {
    Image(Image),
    Text(Text),
    Video(Video),
}
