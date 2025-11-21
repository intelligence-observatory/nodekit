use crate::card::Card;
use crate::{CardKey, Position};
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SlotMap;
use uuid::Uuid;

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
    pub pointer: Position,
    /// A unique ID.
    pub id: Uuid,
}

#[gen_stub_pymethods]
#[pymethods]
impl State {
    /// `board_color` must be a valid RGBA hex string e.g. "#808080ff"
    #[new]
    pub fn new(board_color: String, cards: Vec<Card>) -> Self {
        let mut cards_map = SlotMap::default();
        for card in cards {
            cards_map.insert(card);
        }
        Self {
            cards: cards_map,
            t_msec: 0,
            board_color,
            pointer: Position::default(),
            id: Uuid::new_v4(),
        }
    }
}

impl State {
    /// Returns the visible cards in their render order.
    pub fn get_visible_cards(&self) -> Vec<(CardKey, &Card)> {
        let mut cards = self
            .cards
            .iter()
            .filter(|(_, card)| card.is_visible(self.t_msec))
            .collect::<Vec<(CardKey, &Card)>>();
        cards.sort_by(|a, b| a.1.z_index.cmp(&b.1.z_index));
        cards
    }
}
