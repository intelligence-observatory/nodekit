mod error;
mod pointer;

pub use error::Error;
use nodekit_rs_models::card::{Card, CardKey, CardType, VideoCard};
use nodekit_rs_models::sensor::{ButtonState, Sensor};
use pointer::Pointer;
use pyo3::exceptions::{PyKeyError, PyRuntimeError, PyValueError};
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SlotMap;
use std::str::FromStr;
use uuid::Uuid;

/// Describes the state of the simulator.
#[gen_stub_pyclass]
#[pyclass]
pub struct State {
    /// The node's cards.
    pub cards: SlotMap<CardKey, Card>,
    /// The sensor. May be None if the sensor is non-graphical.
    pub sensor: Sensor,
    /// The time elapsed from the start of the node.
    #[pyo3(get)]
    pub t_msec: u64,
    /// The background color.
    pub board_color: String,
    /// The position of the pointer.
    pub pointer: Pointer,
    /// A unique ID.
    pub id: Uuid,
}

impl State {
    pub fn new_inner(board_color: String, cards: SlotMap<CardKey, Card>, sensor: Sensor) -> Self {
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

    pub fn is_hovering(&self, card_key: CardKey) -> bool {
        match self.sensor.hover.as_ref() {
            Some(sensor) => sensor.is_hovering(card_key),
            None => false,
        }
    }

    pub fn is_selected(&self, card_key: CardKey) -> bool {
        match self.sensor.select.as_ref() {
            Some(select) => select.is_selected(card_key),
            None => false,
        }
    }

    fn set_button(&mut self, state: ButtonState) -> Result<(), Error> {
        match self.sensor.button.as_mut() {
            Some(button) => {
                // Set the state.
                if button.state != state {
                    button.state = state;
                    // Mark the cards as dirty.
                    button
                        .cards
                        .iter()
                        .for_each(|card_key| self.cards[*card_key].dirty = true);
                }
                Ok(())
            }
            None => Err(Error::ConfirmButton),
        }
    }

    /// Set the state of a SliderSensor.
    ///
    /// For tests, call this instead of `set_slider` or there will be a cc link failure.
    ///
    /// - `bin` sets which bin the thumb overlay's position will snap to.
    /// - `committed` sets the color of the thumb overlay, and corresponds to whether the agent has moved the thumb overlay yet.
    /// - `confirm_button_state` sets the state of the confirm button. Fails silently if there is no confirm button.
    ///
    /// Raises an exception if the sensor isn't a TextEntrySensor.
    pub fn set_slider_inner(
        &mut self,
        bin: i64,
        committed: bool,
        confirm_button_state: ButtonState,
    ) -> Result<(), Error> {
        if bin >= 0 {
            if let Some(card_key) = self.sensor.card
                && let CardType::Slider(slider) = &mut self.cards[card_key].card_type
            {
                // Set the slider.
                let bin = bin.cast_unsigned() as usize;
                if bin < slider.num_bins {
                    // Mark the card as dirty only if something changed.
                    if bin != slider.num_bins || committed != slider.committed {
                        slider.committed = committed;
                        slider.bin = bin;
                        self.cards[card_key].dirty = true;
                    }

                    // Set the confirm button.
                    // Fail silently if there is no confirm button.
                    let _ = self.set_button(confirm_button_state);

                    Ok(())
                } else {
                    Err(Error::Bin {
                        bin,
                        num_bins: slider.num_bins,
                    })
                }
            } else {
                Err(Error::NoSlider)
            }
        } else {
            Err(Error::BinValue)
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
    /// `cards` must be of type `nodekit.cards.Card`
    /// `sensor` must be of type `nodekit.sensors.Sensor`.
    ///
    /// Note that only some sensors are implemented in nodekit-rs:
    ///
    /// - MultiSelectSensor
    /// - SelectSensor
    /// - SliderSensor
    /// - TextEntrySensor
    ///
    /// All other sensor types are permitted in this constructor, but won't do anything.
    #[new]
    pub fn new(
        board_color: String,
        card: Option<Bound<'_, PyAny>>,
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
                    CardType::Video(VideoCard {
                        asset: _,
                        looped: _
                    })
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
    /// If `choice` is a string, then it's a key in SelectSensor.choices or MultiSelectSensor.choices
    /// If `choice` is None, then no card will have a hovered state.
    ///
    /// Raises an exception if the sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn hover(&mut self, choice: Option<String>) -> PyResult<()> {
        match self.sensor.hover.as_mut() {
            Some(hover) => hover
                .set_from_choice(choice, &mut self.cards)
                .map_err(|e| PyKeyError::new_err(e.to_string())),
            None => Self::invalid_sensor(),
        }
    }

    /// Select or deselect a MultiSelectSensor's card.
    ///
    /// - `choice` is a key in the sensor's choices.
    /// - `select` sets whether the choice is selected.
    /// - `confirm_button_state` sets the state of the confirm button. Fails silently if there is no confirm button. Options: enabled, disabled, hovering.
    ///
    /// For SelectSensor, this fails silently because the render state wouldn't change.
    /// For MultiSelectSensor, this adds `choice` the sensor isn't a SelectSensor or MultiSelectSensor.
    ///
    /// Raises an exception if sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn select(
        &mut self,
        choice: String,
        select: bool,
        confirm_button_state: String,
    ) -> PyResult<()> {
        let confirm_button_state = ButtonState::from_str(&confirm_button_state)
            .map_err(|e| PyValueError::new_err(e.to_string()))?;
        self.set_button(confirm_button_state)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        match self.sensor.select.as_mut() {
            Some(s) => s
                .select(choice, select, &mut self.cards)
                .map_err(|e| PyKeyError::new_err(e.to_string())),
            None => Self::invalid_sensor(),
        }
    }

    /// Set the text of a TextEntrySensor.
    ///
    /// - `text` is the new text. If empty, the prompt will automatically be shown.
    /// - `gutter_state` sets the state of the gutter. Options: disabled, enabled, hovering.
    ///
    /// Raises an exception if the sensor isn't a TextEntrySensor.
    pub fn set_text_entry(&mut self, text: String, gutter_state: String) -> PyResult<()> {
        if let Some(card_key) = self.sensor.card
            && let CardType::TextEntry(text_entry) = &mut self.cards[card_key].card_type
        {
            // Set the text.
            text_entry.text = text;
            self.cards[card_key].dirty = true;
            let button_state = ButtonState::from_str(&gutter_state)
                .map_err(|e| PyValueError::new_err(e.to_string()))?;

            // Set the gutter.
            self.set_button(button_state)
                .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
            Ok(())
        } else {
            Err(PyValueError::new_err("Failed to find a TextEntrySensor."))
        }
    }

    /// Set the state of a SliderSensor.
    ///
    /// - `bin` sets which bin the thumb overlay's position will snap to.
    /// - `committed` sets the color of the thumb overlay, and corresponds to whether the agent has moved the thumb overlay yet.
    /// - `confirm_button_state` sets the state of the confirm button. Fails silently if there is no confirm button. Options: enabled, disabled, hovering.
    ///
    /// Raises an exception if the sensor isn't a TextEntrySensor.
    pub fn set_slider(
        &mut self,
        bin: i64,
        committed: bool,
        confirm_button_state: String,
    ) -> PyResult<()> {
        let confirm_button_state = if self.sensor.button.is_some() {
            ButtonState::from_str(&confirm_button_state)
                .map_err(|e| PyValueError::new_err(e.to_string()))
        } else {
            Ok(ButtonState::Enabled)
        }?;
        self.set_slider_inner(bin, committed, confirm_button_state)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))
    }
}
