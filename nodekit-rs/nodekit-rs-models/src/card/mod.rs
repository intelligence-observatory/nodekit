mod asset;
mod card_type;
mod slider;
mod text_card;
mod text_entry;

use crate::Region;
pub use asset::Asset;
pub use card_type::CardType;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
pub use slider::*;
use slotmap::{SlotMap, new_key_type};
pub use text_card::*;
pub use text_entry::TextEntry;

new_key_type! { pub struct CardKey; }

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
            region: Self::extract_region(card)?,
            card_type: CardType::extract_card(card)?,
            dirty: false,
        })
    }
}

impl Card {
    /// Extract `obj` into a flat vec of `Card`s.
    pub fn extract_cards(
        card: Bound<'_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<()> {
        // Extract a composite card's children.
        if card.getattr(CARD_TYPE)?.cast::<PyString>()? == "CompositeCard" {
            // Recurse until we get single cards.
            for (_, c) in card.getattr("children")?.cast::<PyDict>()?.iter() {
                Self::extract_cards(c, cards)?;
            }
        } else {
            // Extract a single card.
            cards.insert(Card::extract(card.as_borrowed())?);
        }
        Ok(())
    }

    fn extract_region(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Region> {
        Region::extract(obj.getattr("region")?.as_borrowed())
    }
}
