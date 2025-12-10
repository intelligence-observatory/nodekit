use crate::{CardType, Region};
use pyo3::prelude::PyAnyMethods;
use pyo3::{Borrowed, FromPyObject, PyAny, PyErr};

pub struct Card {
    pub region: Region,
    pub card_type: CardType,
}

impl FromPyObject<'_, '_> for Card {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            region: Region::extract(obj.getattr("region")?.as_borrowed())?,
            card_type: CardType::extract(obj)?,
        })
    }
}
