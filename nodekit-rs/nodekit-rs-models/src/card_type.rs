use crate::*;
use pyo3::{
    exceptions::PyValueError,
    prelude::*,
    types::PyString
};

/// ImageCard, TextCard, etc.
pub enum CardType {
    Image(Asset),
    Slider(Slider),
    Text(TextCard),
    TextEntry(TextEntry),
    Video { asset: Asset, looped: bool },
}

impl CardType {
    fn asset(obj: Borrowed<'_, '_, PyAny>, key: &str) -> PyResult<Asset> {
        Asset::extract(obj.getattr(key)?.as_borrowed())
    }

    pub fn extract_card(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let card_type = obj.getattr(CARD_TYPE)?;
        match card_type.cast::<PyString>()?.to_str()? {
            "ImageCard" => Ok(Self::Image(Self::asset(obj, "image")?)),
            "TextCard" => Ok(Self::Text(obj.extract::<TextCard>()?)),
            "VideoCard" => {
                let asset = Self::asset(obj, "video")?;
                let looped = obj.getattr("loop")?.extract::<bool>()?;
                Ok(Self::Video { asset, looped })
            }
            other => Err(PyValueError::new_err(format!("Invalid card type: {other}"))),
        }
    }

    pub fn extract_sensor(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Option<Self>> {
        let sensor_type = sensor.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "SliderSensor" => {
                let slider = Slider::extract(sensor.as_borrowed())?;
                Ok(Some(Self::Slider(slider)))
            },
            "TextEntrySensor" => {
                let text_entry = TextEntry::extract(sensor.as_borrowed())?;
                Ok(Some(Self::TextEntry(text_entry)))
            }
            _ => Ok(None)
        }
    }
}
