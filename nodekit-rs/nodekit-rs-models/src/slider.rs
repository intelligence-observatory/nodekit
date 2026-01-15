use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;

pub enum SliderOrientation {
    Horizontal,
    Vertical,
}

pub struct Slider {
    pub num_bins: usize,
    pub bin: usize,
    pub show_bin_markers: bool,
    pub orientation: SliderOrientation,
}

impl FromPyObject<'_, '_> for Slider {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        let num_bins = obj.getattr("num_bins")?.extract::<i64>()?.cast_unsigned() as usize;
        let bin_index = obj
            .getattr("initial_bin_index")?
            .extract::<i64>()?
            .cast_unsigned() as usize;
        let show_bin_markers = obj.getattr("show_bin_markers")?.extract::<bool>()?;
        let orientation = match obj.getattr("orientation")?.extract::<&str>()? {
            "horizontal" => Ok(SliderOrientation::Horizontal),
            "vertical" => Ok(SliderOrientation::Vertical),
            other => Err(PyValueError::new_err(format!(
                "Invalid slider orientation: {other}"
            ))),
        }?;
        Ok(Self {
            num_bins,
            bin: bin_index,
            show_bin_markers,
            orientation,
        })
    }
}
