use blittle::{PositionI, PositionU, Size, clip};
use nodekit_rs_visual::{VISUAL_SIZE, size_coordinate, spatial_coordinate};
use pyo3::prelude::{PyAnyMethods, PyFloatMethods};
use pyo3::types::PyFloat;
use pyo3::{Bound, PyAny, PyResult};

/// A blit-able position and size.
pub struct Rect {
    pub position: PositionU,
    pub size: Size,
}

impl Rect {
    pub fn new(card: &Bound<PyAny>) -> PyResult<Self> {
        let position = PositionI {
            x: spatial_coordinate(Self::get_f64(card, "x")?),
            y: spatial_coordinate(Self::get_f64(card, "x")?),
        };
        let mut size = Size {
            w: size_coordinate(Self::get_f64(card, "w")?),
            h: size_coordinate(Self::get_f64(card, "h")?),
        };
        let position = clip(&position, &VISUAL_SIZE, &mut size);
        Ok(Self { position, size })
    }

    fn get_f64(card: &Bound<PyAny>, name: &str) -> PyResult<f64> {
        Ok(card.getattr(name)?.cast::<PyFloat>()?.value())
    }
}
