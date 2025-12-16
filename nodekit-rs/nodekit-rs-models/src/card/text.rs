use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyString;

#[derive(Copy, Clone, Debug)]
pub enum JustificationHorizontal {
    Left,
    Center,
    Right,
}

impl<'py> FromPyObject<'_, 'py> for JustificationHorizontal {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let justification = obj.cast::<PyString>()?;
        match justification.to_str()? {
            "left" => Ok(Self::Left),
            "center" => Ok(Self::Center),
            "right" => Ok(Self::Right),
            other => Err(PyValueError::new_err(format!(
                "Invalid justification: {other}"
            ))),
        }
    }
}

#[derive(Copy, Clone, Debug)]
pub enum JustificationVertical {
    Top,
    Center,
    Bottom,
}

impl<'py> FromPyObject<'_, 'py> for JustificationVertical {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let justification = obj.cast::<PyString>()?;
        match justification.to_str()? {
            "top" => Ok(Self::Top),
            "center" => Ok(Self::Center),
            "bottom" => Ok(Self::Bottom),
            other => Err(PyValueError::new_err(format!(
                "Invalid justification: {other}"
            ))),
        }
    }
}

/// Parameters for a text card.
pub struct TextCard {
    pub text: String,
    pub font_size: f64,
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
    pub text_color: String,
    pub background_color: String,
}

impl<'py> FromPyObject<'_, 'py> for TextCard {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            text: obj.getattr("text")?.extract::<String>()?,
            font_size: obj.getattr("font_size")?.extract::<f64>()?,
            justification_horizontal: JustificationHorizontal::extract(
                obj.getattr("justification_horizontal")?.as_borrowed(),
            )?,
            justification_vertical: JustificationVertical::extract(
                obj.getattr("justification_vertical")?.as_borrowed(),
            )?,
            text_color: obj.getattr("text_color")?.extract::<String>()?,
            background_color: obj.getattr("background_color")?.extract::<String>()?,
        })
    }
}
