use pyo3::{pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pyclass_enum, gen_stub_pymethods};

#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Copy, Clone, Default)]
pub enum JustificationHorizontal {
    #[default]
    Left,
    Center,
    Right,
}

#[gen_stub_pyclass_enum]
#[pyclass]
#[derive(Copy, Clone, Default)]
pub enum JustificationVertical {
    #[default]
    Top,
    Center,
    Bottom,
}

#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Text {
    /// A markdown string.
    pub text: String,
    /// The font size. 0 to 1, where 1 is the height of the board.
    pub font_size: f64,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
    /// An RGBA background color e.g. #FF0000FF
    pub background_color: String,
}

#[gen_stub_pymethods]
#[pymethods]
impl Text {
    #[new]
    pub fn new(
        text: String,
        font_size: f64,
        justification_horizontal: JustificationHorizontal,
        justification_vertical: JustificationVertical,
        background_color: String,
    ) -> Self {
        Self {
            text,
            font_size,
            justification_horizontal,
            justification_vertical,
            background_color,
        }
    }
}
