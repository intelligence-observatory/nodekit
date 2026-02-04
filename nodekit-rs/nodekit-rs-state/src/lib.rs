mod pointer;

use nodekit_rs_models::card::{Card, CardKey, CardType, VideoCard};
use nodekit_rs_models::sensor::{Enable, EnableKey, GraphicalSensor, Hover, Sensor};
use pointer::Pointer;
use pyo3::exceptions::{PyKeyError, PyRuntimeError, PyValueError};
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
    pub sensor: Sensor,
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

    pub fn is_enabled(&self, card_key: CardKey) -> bool {
        match self.sensor.enable.as_ref() {
            Some(enable) => enable.is_enabled(card_key),
            None => false,
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
    /// Note that only some sensors are supported in nodekit-rs:
    /// - SelectSensor
    /// - MultiSelectSensor
    ///
    /// All other sensor types are permitted, but will fail silently.
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
    /// Raises an exception if there is no sensor,
    /// or if the sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn hover(&mut self, choice: Option<String>) -> PyResult<()> {
        match self.sensor.hover.as_mut() {
            Some(hover) => hover
                .set(choice, &mut self.cards)
                .map_err(|e| PyKeyError::new_err(e.to_string())),
            None => Self::invalid_sensor(),
        }
    }

    /// Select or deselect a MultiSelectSensor's card.
    ///
    /// If `choice` is a key in MultiSelectSensor.choices
    ///
    /// For SelectSensor, this fails silently because the render state wouldn't change.
    /// For MultiSelectSensor, this adds `choice` the sensor isn't a SelectSensor or MultiSelectSensor.
    pub fn select(&mut self, choice: String, select: bool) -> PyResult<()> {
        match self.sensor.select.as_mut() {
            Some(s) => s
                .select(choice, select, &mut self.cards)
                .map_err(|e| PyKeyError::new_err(e.to_string())),
            None => Self::invalid_sensor(),
        }
    }

    /// Set the text of a TextEntrySensor.
    ///
    /// Raises an exception if the sensor isn't a TextEntrySensor.
    pub fn set_text_entry(&mut self, text: String) -> PyResult<()> {
        match &self.sensor.graphical {
            Some(graphical) => {
                let card_key = graphical.card();
                if let CardType::TextEntry(text_entry) = &mut self.cards[card_key].card_type {
                    text_entry.text = text;
                    self.cards[card_key].dirty = true;
                    Ok(())
                } else {
                    Err(PyValueError::new_err("Failed to find a TextEntrySensor."))
                }
            }
            None => Self::invalid_sensor(),
        }
    }

    /// Set the state of a SliderSensor.
    ///
    /// - `bin` sets which bin the thumb overlay's position will snap to.
    /// - `committed` determines the color of the thumb overlay, and corresponds to whether the agent has moved the thumb overlay yet.
    ///
    /// Raises an exception if the sensor isn't a TextEntrySensor.
    pub fn set_slider(&mut self, bin: i64, committed: bool) -> PyResult<()> {
        if bin >= 0 {
            if let Some(GraphicalSensor::Slider { card, enable: _ }) = &self.sensor.graphical
                && let CardType::Slider(slider) = &mut self.cards[*card].card_type
            {
                let bin = bin.cast_unsigned() as usize;
                if bin < slider.num_bins {
                    slider.committed = committed;
                    slider.bin = bin;
                    self.cards[*card].dirty = true;
                    Ok(())
                } else {
                    Err(PyValueError::new_err(format!(
                        "bin is {bin} but it must be less than the slider's total number of bins ({0})",
                        slider.num_bins
                    )))
                }
            } else {
                Self::invalid_sensor()
            }
        } else {
            Err(PyValueError::new_err("bin must be greater than 0."))
        }
    }

    /// Set the state of the confirm button.
    ///
    /// - enabled sets whether the button is enabled or disabled.
    /// - hovered sets whether there is a hover overlay on top of the button.
    ///
    /// Raises an exception if there isn't a confirm button.
    pub fn set_confirm_button(&mut self, enabled: bool, hovering: bool) -> PyResult<()> {
        fn set(
            enabled: bool,
            enable_key: EnableKey,
            enable: &mut Enable,
            hovering: bool,
            hover: &mut Hover,
            cards: &mut SlotMap<CardKey, Card>,
        ) -> PyResult<()> {
            enable.set(enable_key, enabled, cards);
            for card_key in enable.get_cards(enable_key).iter().copied() {
                // Mark the card as dirty.
                cards[card_key].dirty = true;
                // Set hovering.
                let card_key = if hovering { Some(card_key) } else { None };
                hover
                    .set_from_card_key(card_key, cards)
                    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
            }
            Ok(())
        }

        if let Some(enable) = self.sensor.enable.as_mut()
            && let Some(hover) = self.sensor.hover.as_mut()
        {
            if let Some(GraphicalSensor::Slider {
                card: _,
                enable: enable_key,
            }) = &self.sensor.graphical
                && let Some(enable_key) = enable_key
            {
                set(
                    enabled,
                    *enable_key,
                    enable,
                    hovering,
                    hover,
                    &mut self.cards,
                )?;
                enable.set(*enable_key, enabled, &mut self.cards);
                Ok(())
            } else if let Some(select) = self.sensor.select.as_mut() {
                set(
                    enabled,
                    select.confirm_button,
                    enable,
                    hovering,
                    hover,
                    &mut self.cards,
                )?;
                Ok(())
            } else {
                Ok(())
            }
        } else {
            Err(PyRuntimeError::new_err("Confirm button not found."))
        }
    }
}
