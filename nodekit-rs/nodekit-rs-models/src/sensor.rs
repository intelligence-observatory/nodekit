use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
use crate::{Card, Region};

pub enum SliderOrientation {
    Horizontal,
    Vertical,
}

pub enum Sensor {
    Select(Vec<Card>),
    Slider {
        num_bins: usize,
        bin: usize,
        show_bin_markers: bool,
        orientation: SliderOrientation,
        region: Region,
    },
    TextEntry {
        prompt: String,
        font_size: i64,
        region: Region,
    }
}

impl Sensor {
    pub fn extract(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Option<Self>> {
        let sensor_type = obj.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "SliderSensor" => Ok(Self::extract_slider(obj).ok()),
            "TextEntrySensor" => Ok(Self::extract_text_entry(obj).ok()),
            _ => Ok(None)
        }
    }

    fn extract_select(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let choices = sensor.getattr("choices")?;
        let choices = choices.cast::<PyDict>();

        Ok(Self::Select(Vec::default()))
    }

    fn extract_slider(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let num_bins = sensor.getattr("num_bins")?.extract::<i64>()?.cast_unsigned() as usize;
        let bin_index = sensor
            .getattr("initial_bin_index")?
            .extract::<i64>()?
            .cast_unsigned() as usize;
        let show_bin_markers = sensor.getattr("show_bin_markers")?.extract::<bool>()?;
        let orientation = match sensor.getattr("orientation")?.extract::<&str>()? {
            "horizontal" => Ok(SliderOrientation::Horizontal),
            "vertical" => Ok(SliderOrientation::Vertical),
            other => Err(PyValueError::new_err(format!(
                "Invalid slider orientation: {other}"
            ))),
        }?;
        let region = Region::extract(sensor)?;
        Ok(Self::Slider {
            num_bins,
            bin: bin_index,
            show_bin_markers,
            orientation,
            region
        })
    }

    fn extract_text_entry(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let prompt = sensor.getattr("prompt")?.extract::<String>()?;
        let font_size = sensor.getattr("font_size")?.extract::<i64>()?;
        let region = Region::extract(sensor)?;
        Ok(Self::TextEntry {
            prompt,
            font_size,
            region
        })
    }
}