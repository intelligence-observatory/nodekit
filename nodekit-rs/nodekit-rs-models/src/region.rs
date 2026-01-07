use pyo3::prelude::*;
use nodekit_rs_board_constants::*;

/// A card's spatial region.
#[derive(Clone, Debug)]
pub struct Region {
    pub x: i64,
    pub y: i64,
    pub w: i64,
    pub h: i64,
    pub z_index: Option<i64>,
}

impl Default for Region {
    fn default() -> Self {
        Self {
            x: -BOARD_D_I64_HALF,
            y: -BOARD_D_I64_HALF,
            w: BOARD_D_I64,
            h: BOARD_D_I64_HALF,
            z_index: None,
        }
    }
}

impl<'py> FromPyObject<'_, 'py> for Region {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            x: obj.getattr("x")?.extract::<i64>()?,
            y: obj.getattr("y")?.extract::<i64>()?,
            w: obj.getattr("w")?.extract::<i64>()?,
            h: obj.getattr("h")?.extract::<i64>()?,
            z_index: obj.getattr("z_index")?.extract::<Option<i64>>()?,
        })
    }
}
