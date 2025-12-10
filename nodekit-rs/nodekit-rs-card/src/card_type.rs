use pyo3::prelude::*;
use pyo3::types::PyString;
use crate::asset::Asset;

pub enum CardType {
    Image(Asset),
    Video {
        asset: Asset,
        looped: bool,
        start: bool,
    }
}

impl CardType {
    fn asset(obj: Borrowed<'_, '_, PyAny>, key: &str) -> PyResult<Asset> {
        Asset::extract(obj.getattr(key)?.as_borrowed())
    }
}

impl<'py> FromPyObject<'_, 'py> for CardType {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let card_type = obj
            .getattr("card_type")?;
        match card_type.cast::<PyString>()?.to_str()? {
            "ImageCard" => {
                Ok(Self::Image(Self::asset(obj, "image")?))
            },
            "VideoCard" => {
                let asset = Self::asset(obj, "video")?;
                Ok(Self::Image())
            }
            other => panic!("here")
        }
    }
}
