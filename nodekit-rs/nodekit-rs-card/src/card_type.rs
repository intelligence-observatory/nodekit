use crate::asset::Asset;
use crate::justification::{JustificationHorizontal, JustificationVertical};
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyString;

pub enum CardType {
    Image(Asset),
    Text {
        text: String,
        font_size: f64,
        justification_horizontal: JustificationHorizontal,
        justification_vertical: JustificationVertical,
        text_color: String,
        background_color: String,
    },
    Video {
        asset: Asset,
        looped: bool,
    },
}

impl CardType {
    fn asset(obj: Borrowed<'_, '_, PyAny>, key: &str) -> PyResult<Asset> {
        Asset::extract(obj.getattr(key)?.as_borrowed())
    }
}

impl<'py> FromPyObject<'_, 'py> for CardType {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let card_type = obj.getattr("card_type")?;
        match card_type.cast::<PyString>()?.to_str()? {
            "ImageCard" => Ok(Self::Image(Self::asset(obj, "image")?)),
            "TextCard" => Ok(Self::Text {
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
            }),
            "VideoCard" => {
                let asset = Self::asset(obj, "video")?;
                let looped = obj.getattr("loop")?.extract::<bool>()?;
                Ok(Self::Video { asset, looped })
            }
            other => Err(PyValueError::new_err(format!("Invalid card type: {other}"))),
        }
    }
}
