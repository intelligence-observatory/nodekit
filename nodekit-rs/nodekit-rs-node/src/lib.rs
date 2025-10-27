mod card;
mod media_type;
mod rect;
mod timer;

use card::Card;
use media_type::MediaType;
use pyo3::prelude::*;
use pyo3::types::PyList;
use timer::Timer;

#[pyclass]
pub struct Node {
    cards: Vec<Card>,
}

#[pymethods]
impl Node {
    #[new]
    pub fn new(node: &Bound<'_, PyAny>) -> PyResult<Self> {
        let mut cards = Vec::default();
        for card in node.getattr("cards")?.cast::<PyList>()?.iter() {
            cards.push(Card::new(&card)?);
        }
        Ok(Self {
            cards
        })
    }
}

impl Node {

    pub fn get_cards(&self, time: u64) -> Vec<&Card> {
        self.cards
            .iter()
            .filter(|card| card.timer.t0 >= time && match card.timer.t1 {
                Some(t1) => t1 < time,
                None => false
            })
            .collect()
    }
}
