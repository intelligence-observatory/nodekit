use pyo3::pyclass;
use pyo3_stub_gen::derive::gen_stub_pyclass_enum;

#[pyclass]
#[gen_stub_pyclass_enum]
pub enum SensorType {
    Slider,
    TextEntry
}