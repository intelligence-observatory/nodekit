mod asset;
mod card;
mod card_type;
mod justification;
mod region;

use crate::card::Card;
pub use card_type::CardType;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList, PyString};
pub use region::*;

pub enum CardExtractor {
    Card(Card),
    CompositeCard(Vec<Card>),
}

impl CardExtractor {
    pub fn extract_all(obj: &Bound<'_, PyList>) -> PyResult<Vec<Card>> {
        let mut cards = Vec::default();
        for cs in obj.iter().map(|item| Self::extract_item(item)) {
            cards.append(&mut cs?);
        }
        Ok(cards)
    }

    fn extract_item(item: Bound<'_, PyAny>) -> PyResult<Vec<Card>> {
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
