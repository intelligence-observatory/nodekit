mod asset;
mod card_type;
mod slider;
mod text;
mod text_entry;
mod video;

use crate::Region;
pub use asset::Asset;
pub use card_type::CardType;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
pub use slider::*;
use slotmap::{SlotMap, new_key_type};
pub use text::*;
pub use text_entry::TextEntry;
pub use video::VideoCard;

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
            region: Region::extract(card.getattr("region")?.as_borrowed())?,
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
}
