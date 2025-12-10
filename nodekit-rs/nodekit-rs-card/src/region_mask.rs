use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyString;

#[derive(Debug)]
pub enum RegionMask {
    Rectangle,
    Ellipse
}

#[pyfunction]
pub fn test_region_mask(obj: &Bound<'_, PyAny>) -> PyResult<()> {
    obj.extract::<RegionMask>().map(|_| ())
}

impl<'py> FromPyObject<'_, 'py> for RegionMask {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let s = obj.cast::<PyString>()?;
        match s.to_str()? {
            "rectangle" => Ok(Self::Rectangle),
            "ellipse" => Ok(Self::Ellipse),
            other => Err(PyValueError::new_err(format!("Invalid region mask type: {other}")))
        }
    }
}