use pyo3::prelude::*;

/// A card's spatial region.
#[derive(Clone, Debug)]
pub struct Region {
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
    pub z_index: Option<i64>,
}

impl Default for Region {
    fn default() -> Self {
        Self {
            x: -0.5,
            y: -0.5,
            w: 1.,
            h: 1.,
            z_index: None,
        }
    }
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
