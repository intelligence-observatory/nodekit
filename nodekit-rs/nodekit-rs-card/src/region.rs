use pyo3::prelude::*;
use crate::test_extraction;

pub struct Region {
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
    pub z_index: Option<i64>,
}

impl<'py> FromPyObject<'_, 'py> for Region {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            x: obj.getattr("x")?.extract::<f64>()?,
            y: obj.getattr("y")?.extract::<f64>()?,
            w: obj.getattr("w")?.extract::<f64>()?,
            h: obj.getattr("h")?.extract::<f64>()?,
            z_index: obj.getattr("z_index")?.extract::<Option<i64>>()?,
        })
    }
}

test_extraction!(test_region, Region);