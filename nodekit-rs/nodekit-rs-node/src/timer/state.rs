use pyo3::prelude::*;

#[pyclass(eq)]
#[derive(Eq, PartialEq, Debug)]
pub enum TimerState {
    Pending,
    Starting,
    Active,
    Ending,
    Finished,
}
