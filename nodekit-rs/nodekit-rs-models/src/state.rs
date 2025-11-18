use crate::card::Card;
use crate::{CardKey, Position};
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SlotMap;

/// Describes the state of the simulator.
#[gen_stub_pyclass]
#[pyclass]
pub struct State {
    /// The node's cards.
    pub cards: SlotMap<CardKey, Card>,
    /// The time elapsed from the start of the node.
    #[pyo3(get, set)]
    pub t_msec: u64,
    /// The background color.
    pub board_color: String,
    /// The position of the cursor.
    pub cursor: Position,
}

#[gen_stub_pymethods]
#[pymethods]
impl State {
    /// `board_color` must be a valid RGBA hex string e.g. "#808080ff"
    #[new]
    pub fn new(board_color: String) -> Self {
        Self {
            cards: Default::default(),
            t_msec: 0,
            board_color,
            cursor: Position::default(),
        }
    }

    /// Add a card to the state.
    pub fn add_card(&mut self, card: Card) {
        self.cards.insert(card);
    }
}

impl State {
    /// Returns the cards in their render order.
    pub fn get_ordered_cards(&self) -> Vec<(CardKey, &Card)> {
        let mut cards = self.cards.iter().collect::<Vec<(CardKey, &Card)>>();
        cards.sort_by(|a, b| a.1.z_index.cmp(&b.1.z_index));
        cards
    }
}
