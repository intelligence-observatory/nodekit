mod pointer;

use nodekit_rs_models::{Card, CardType};
use pointer::Pointer;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyList;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::{SlotMap, new_key_type};
use uuid::Uuid;

new_key_type! { pub struct CardKey; }

/// Describes the state of the simulator.
#[gen_stub_pyclass]
#[pyclass]
pub struct State {
    /// The node's cards.
    pub cards: SlotMap<CardKey, Card>,
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
    pub fn new_inner(board_color: String, mut cards: Vec<Card>, sensor: Option<Card>) -> Self {
        // Include the sensor.
        if let Some(sensor) = sensor {
            cards.push(sensor);
            // Set the rendering order.
            Card::sort(&mut cards);
        }
        // Convert to a map.
        let mut cards_map = SlotMap::with_capacity_and_key(cards.len());
        for card in cards {
            cards_map.insert(card);
        }
        Self {
            cards: cards_map,
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
    pub fn new(
        board_color: String,
        cards: Bound<'_, PyList>,
        sensor: Bound<'_, PyAny>,
    ) -> PyResult<Self> {
        Ok(Self::new_inner(
            board_color,
            Card::extract_all(cards)?,
            Card::extract_sensor(sensor)?,
        ))
    }

    #[setter]
    pub fn set_t_msec(&mut self, value: u64) {
        self.t_msec = value;
        self.cards
            .values_mut()
            .filter(|card| {
                matches!(
                    &card.card_type,
                    CardType::Video {
                        asset: _,
                        looped: _
                    }
                )
            })
            .for_each(|card| card.dirty = true);
    }

    /// Set the coordinates of the pointer.
    /// The coordinates must be between -512 and 512.
    pub fn set_pointer(&mut self, x: i64, y: i64) {
        self.pointer.x = x;
        self.pointer.y = y;
    }

    /// Try to set the text in a TextEntry sensor.
    pub fn set_text_entry(&mut self, text: String) -> PyResult<()> {
        match self
            .cards
            .values_mut()
            .find_map(|card| match &mut card.card_type {
                CardType::TextEntry(text_entry) => Some((text_entry, &mut card.dirty)),
                _ => None,
            }) {
            Some((text_entry, dirty)) => {
                text_entry.text = text;
                *dirty = true;
                Ok(())
            }
            None => Err(PyValueError::new_err("Failed to find a TextEntrySensor.")),
        }
    }

    /// Try to set the position of a SliderSensor.
    pub fn set_slider_bin(&mut self, bin: usize) -> PyResult<()> {
        match self
            .cards
            .values_mut()
            .find_map(|card| match &mut card.card_type {
                CardType::Slider(slider) => Some((slider, &mut card.dirty)),
                _ => None,
            }) {
            Some((slider, dirty)) => {
                slider.bin = bin;
                *dirty = true;
                Ok(())
            }
            None => Err(PyValueError::new_err("Failed to find a TextEntrySensor.")),
        }
    }
}
