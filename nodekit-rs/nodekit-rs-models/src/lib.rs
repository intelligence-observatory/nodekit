//! Extract nodekit Card models into nodekit-rs structs.

mod asset;
pub mod board;
mod card_type;
mod region;
mod slider;
mod text_card;
mod text_entry;

pub use asset::Asset;
pub use card_type::*;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
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

    fn extract(card: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            region: Region::extract(card.getattr("region")?.as_borrowed())?,
            card_type: CardType::extract_card(card)?,
            dirty: false,
        })
    }
}

impl Card {
    /// Extract `obj` into a flat vec of `Card`s.
    pub fn extract_cards(card: Bound<'_, PyAny>, cards: &mut Vec<Card>) -> PyResult<()> {
        // Extract a composite card's children.
        if card.getattr(CARD_TYPE)?.cast::<PyString>()? == "CompositeCard" {
            // Recurse until we get single cards.
            for (_, c) in card.getattr("children")?.cast::<PyDict>()?.iter() {
                Self::extract_cards(c, cards)?;
            }
        } else {
            // Extract a single card.
            cards.push(Card::extract(card.as_borrowed())?);
        }
        // Set the rendering order.
        Self::sort(cards);
        Ok(())
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

    fn extract_region(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Region> {
        Region::extract(obj.getattr("region")?.as_borrowed())
    }
}
