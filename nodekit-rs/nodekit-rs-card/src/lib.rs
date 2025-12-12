mod asset;
mod card;
mod card_type;
mod region;
mod text;

pub use asset::Asset;
pub use card_type::CardType;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList, PyString};
pub use region::*;
pub use text::*;

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

impl Card {
    /// Extract `obj` into a flat vec of `Card`s.
    pub fn extract_all(obj: &Bound<'_, PyList>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        for cs in obj.iter().map(|item| Self::extract_item(item)) {
            cards.append(&mut cs?);
        }
        Ok(cards)
    }

    /// Extract an item in a list of cards.
    /// The item might be a nested composite card.
    fn extract_item(item: Bound<'_, PyAny>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        // Extract a composite card's children.
        if item.getattr("card_type")?.cast::<PyString>()? == "CompositeCard" {
            // Recurse until we get single cards.
            for item in item
                .getattr("children")?
                .cast::<PyDict>()?
                .iter()
                .map(|(_, v)| Self::extract_item(v))
            {
                cards.append(&mut item?);
            }
        } else {
            // Extract a single card.
            cards.push(Card::extract(item.as_borrowed())?);
        }
        Ok(cards)
    }
}
