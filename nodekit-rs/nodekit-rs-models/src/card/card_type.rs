use super::{Asset, CARD_TYPE, Slider, TextCard, TextEntry};
use crate::card::video::VideoCard;
use pyo3::{exceptions::PyValueError, prelude::*, types::PyString};

/// ImageCard, TextCard, etc.
pub enum CardType {
    Image(Asset),
    Slider(Slider),
    Text(TextCard),
    TextEntry(TextEntry),
    Video(VideoCard),
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
                Ok(Self::Video(VideoCard { asset, looped }))
            }
            other => Err(PyValueError::new_err(format!("Invalid card type: {other}"))),
        }
    }
}
