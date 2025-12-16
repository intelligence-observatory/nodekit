mod pointer;

use nodekit_rs_card::{Card, CardType};
use pointer::Pointer;
use pyo3::prelude::*;
use pyo3::types::PyList;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use uuid::Uuid;

/// Describes the state of the simulator.
#[gen_stub_pyclass]
#[pyclass]
pub struct State {
    /// The node's cards.
    pub cards: Vec<Card>,
    /// The time elapsed from the start of the node.
    #[pyo3(get)]
    pub t_msec: u64,
    /// The background color.
    pub board_color: String,
    /// The position of the cursor.
    pub pointer: Pointer,
    /// A unique ID.
    pub id: Uuid,
}

impl State {
    pub fn from_cards(board_color: String, cards: Vec<Card>) -> Self {
        Self {
            cards,
            t_msec: 0,
            board_color,
            pointer: Pointer::default(),
            id: Uuid::new_v4(),
        }
    }
}

#[gen_stub_pymethods]
#[pymethods]
impl State {
    /// `board_color` must be a valid RGBA hex string e.g. "#808080ff"
    /// `cards` must be of type `List[nodekit.Card]`
    #[new]
    pub fn new(board_color: String, cards: &Bound<'_, PyList>) -> PyResult<Self> {
        Ok(Self::from_cards(board_color, Card::extract_all(cards)?))
    }

    #[setter]
    pub fn set_t_msec(&mut self, value: u64) {
        self.t_msec = value;
        self.cards.iter_mut().filter(|card| matches!(&card.card_type, CardType::Video { asset: _, looped: _})).for_each(|card| card.dirty = true);
    }

    /// Set the coordinates of the pointer.
    /// The coordinates must be between -0.5 and 0.5
    pub fn set_pointer(&mut self, x: f64, y: f64) {
        self.pointer.x = x;
        self.pointer.y = y;
    }
}
