mod asset;
mod card_type;
mod text;

use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList, PyString};
pub use asset::Asset;
pub use card_type::CardType;
pub use text::*;
use crate::Region;

const CARD_TYPE: &str = "card_type";

/// A representation of a nodekit card.
pub struct Card {
    /// The spatial region.
    pub region: Region,
    /// ImageCard, TextCard, etc.
    pub card_type: CardType,
    /// True if the card needs to be rerendered.
    pub dirty: bool
}

impl FromPyObject<'_, '_> for Card {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            region: Region::extract(obj.getattr("region")?.as_borrowed())?,
            card_type: CardType::extract(obj)?,
            dirty: false,
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
        // Set the rendering order.
        cards.sort_by(|a, b| a.region.z_index.cmp(&b.region.z_index));
        Ok(cards)
    }

    /// Extract an item in a list of cards.
    /// The item might be a nested composite card.
    fn extract_item(item: Bound<'_, PyAny>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        // Extract a composite card's children.
        if item.getattr(CARD_TYPE)?.cast::<PyString>()? == "CompositeCard" {
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