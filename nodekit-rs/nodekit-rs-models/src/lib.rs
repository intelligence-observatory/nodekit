//! Extract nodekit Card models into nodekit-rs structs.

mod asset;
mod card_type;
mod region;
mod slider;
mod text_card;
mod text_entry;

pub use asset::Asset;
pub use card_type::*;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList, PyString};
pub use region::*;
pub use slider::*;
pub use text_card::*;
pub use text_entry::TextEntry;

const CARD_TYPE: &str = "card_type";

/// A representation of a nodekit card.
pub struct Card {
    /// The spatial region.
    pub region: Region,
    /// ImageCard, TextCard, etc.
    pub card_type: CardType,
    /// True if the card needs to be rerendered.
    pub dirty: bool,
}

impl FromPyObject<'_, '_> for Card {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            region: Region::extract(obj.getattr("region")?.as_borrowed())?,
            card_type: CardType::extract_card(obj)?,
            dirty: false,
        })
    }
}

impl Card {
    /// Extract `obj` into a flat vec of `Card`s.
    pub fn extract_all(obj: Bound<'_, PyList>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        for cs in obj.iter().map(|item| Self::extract_card(item)) {
            cards.append(&mut cs?);
        }
        // Set the rendering order.
        Self::sort(&mut cards);
        Ok(cards)
    }

    pub fn extract_sensor(sensor: Bound<'_, PyAny>) -> PyResult<Option<Self>> {
        let sensor = sensor.as_borrowed();
        match CardType::extract_sensor(sensor)? {
            Some(card_type) => Ok(Some(Self {
                card_type,
                region: Self::extract_region(sensor)?,
                dirty: false,
            })),
            None => Ok(None),
        }
    }

    pub fn sort(cards: &mut [Self]) {
        cards.sort_by(|a, b| a.region.z_index.cmp(&b.region.z_index));
    }

    /// Extract an item in a list of cards.
    /// The item might be a nested composite card.
    fn extract_card(card: Bound<'_, PyAny>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        // Extract a composite card's children.
        if card.getattr(CARD_TYPE)?.cast::<PyString>()? == "CompositeCard" {
            // Recurse until we get single cards.
            for item in card
                .getattr("children")?
                .cast::<PyDict>()?
                .iter()
                .map(|(_, v)| Self::extract_card(v))
            {
                cards.append(&mut item?);
            }
        } else {
            // Extract a single card.
            cards.push(Card::extract(card.as_borrowed())?);
        }
        Ok(cards)
    }

    fn extract_region(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Region> {
        Region::extract(obj.getattr("region")?.as_borrowed())
    }
}
