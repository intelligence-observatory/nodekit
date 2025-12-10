use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyString;

#[derive(Copy, Clone, Debug, Default)]
pub enum JustificationHorizontal {
    #[default]
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

#[derive(Copy, Clone, Debug, Default)]
pub enum JustificationVertical {
    #[default]
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
