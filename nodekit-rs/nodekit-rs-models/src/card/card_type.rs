use super::{
    CARD_TYPE,
    asset::Asset,
    text::TextCard
};
use pyo3::{
    exceptions::PyValueError,
    prelude::*,
    types::PyString
};

/// ImageCard, TextCard, etc.
pub enum CardType {
    Image(Asset),
    Text(TextCard),
    Video { asset: Asset, looped: bool },
}

impl CardType {
    fn asset(obj: Borrowed<'_, '_, PyAny>, key: &str) -> PyResult<Asset> {
        Asset::extract(obj.getattr(key)?.as_borrowed())
    }
}

impl<'py> FromPyObject<'_, 'py> for CardType {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
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
}
