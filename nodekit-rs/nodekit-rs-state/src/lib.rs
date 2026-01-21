mod pointer;

use nodekit_rs_models::card::{Card, CardKey, CardType};
use nodekit_rs_models::sensor::Sensor;
use pointer::Pointer;
use pyo3::exceptions::{PyKeyError, PyValueError};
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
    /// The sensor. May be None if the sensor is non-graphical.
    pub sensor: Option<Sensor>,
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
    pub fn new_inner(
        board_color: String,
        cards: SlotMap<CardKey, Card>,
        sensor: Option<Sensor>,
    ) -> Self {
        let mut s = Self {
            cards,
            sensor,
            t_msec: 0,
            board_color,
            pointer: Pointer::default(),
            id: Uuid::new_v4(),
        };
        s.set_pointer(0, 0);
        s
    }

    pub fn get_hovering_over(&self) -> Vec<CardKey> {
        match self.sensor.as_ref() {
            Some(sensor) => match sensor.get_hovering_over() {
                Some(hovering) => hovering.clone(),
                None => Vec::default(),
            },
            None => Vec::default(),
        }
    }

    pub fn get_selected(&self) -> Vec<CardKey> {
        match self.sensor.as_ref() {
            Some(sensor) => sensor.get_selected().unwrap_or_else(|| Vec::default()),
            None => Vec::default(),
        }
    }

    fn invalid_sensor() -> PyResult<()> {
        Err(PyValueError::new_err("Failed to find a renderable sensor."))
    }
}

#[gen_stub_pymethods]
#[pymethods]
impl State {
    /// `board_color` must be a valid RGBA hex string e.g. "#808080ff"
    /// `cards` must be of type `nodekit.Card`
    #[new]
    pub fn new(
        board_color: String,
        card: Bound<'_, PyAny>,
        sensor: Bound<'_, PyAny>,
    ) -> PyResult<Self> {
        let mut cards = SlotMap::default();
        // Extract cards.
        Card::extract_cards(card, &mut cards)?;
        // Try to extract a sensor, and possibly extract more cards.
        let sensor = Sensor::extract(sensor.as_borrowed(), &mut cards)?;
        Ok(Self::new_inner(board_color, cards, sensor))
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
    ///
    /// If the sensor is a SelectSensor or MultiSelectSensor, this will automatically set the hovering state of the cards, if applicable.
    pub fn set_pointer(&mut self, x: i64, y: i64) {
        self.pointer.x = x;
        self.pointer.y = y;
    }

    /// Set which card has a hovered state.
    ///
    /// If id is a string, then it's a key in SelectSensor.choices or MultiSelectSensor.choices
    /// If id is None, then no card will have a hovered state.
    ///
    /// Throws an exception if there is no sensor,
    /// or if the sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn set_hovering(&mut self, choice: Option<String>) -> PyResult<()> {
        // Set the hovering state.
        match self.sensor.as_mut() {
            Some(sensor) => match sensor {
                Sensor::Select(select) => {
                    // Set the hover state and mark cards as dirty.
                    select
                        .hover
                        .set(choice, &mut self.cards)
                        .map_err(|e| PyKeyError::new_err(e.to_string()))?;
                    Ok(())
                }
                Sensor::Hover(hover) => {
                    // Set the hover state and mark cards as dirty.
                    hover
                        .set(choice, &mut self.cards)
                        .map_err(|e| PyKeyError::new_err(e.to_string()))?;
                    // Set the sensor as dirty.
                    Ok(())
                }
                _ => Err(PyValueError::new_err(
                    "Failed to find a SelectSensor or MultiSelectSensor.",
                )),
            },
            None => Self::invalid_sensor(),
        }
    }

    /// Select or deselect a MultiSelectSensor's card.
    ///
    /// For SelectSensor, this fails silently because the render state wouldn't change.
    /// For MultiSelectSensor, this adds `choice` the sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn select(&mut self, choice: String, select: bool) -> PyResult<()> {
        match self.sensor.as_mut() {
            Some(sensor) => match sensor {
                // No need to render anything.
                Sensor::Hover(_) => Ok(()),
                Sensor::Select(select_sensor) => {
                    select_sensor
                        .select(choice, select, &mut self.cards)
                        .map_err(|e| PyKeyError::new_err(e.to_string()))?;
                    Ok(())
                }
                _ => Err(PyValueError::new_err(
                    "Failed to find a SelectSensor or MultiSelectSensor.",
                )),
            },
            None => Self::invalid_sensor(),
        }
    }

    /// Set the text of a TextEntrySensor.
    ///
    /// Throws an exception if the sensor isn't a TextEntrySensor.
    pub fn set_text_entry(&mut self, text: String) -> PyResult<()> {
        match self.sensor.as_mut() {
            Some(sensor) => {
                if let Sensor::TextEntry(text_entry) = sensor
                    && let CardType::TextEntry(text_entry) = &mut self.cards[*text_entry].card_type
                {
                    text_entry.text = text;
                    Ok(())
                } else {
                    Err(PyValueError::new_err("Failed to find a TextEntrySensor."))
                }
            }
            None => Self::invalid_sensor(),
        }
    }
}
