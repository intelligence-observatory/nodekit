mod pointer;

use nodekit_rs_models::{Card, CardType, SelectableCardKey, Sensor, SensorType};
use pointer::Pointer;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::{SlotMap, new_key_type};
use uuid::Uuid;

macro_rules! start_hovering {
    ($sensor:ident, $hovering:ident, $k:ident) => {{
        if *$hovering != Some($k) {
            *$hovering = Some($k);
            $sensor.dirty = true;
        }
    }};
}

macro_rules! stop_hovering {
    ($sensor:ident, $hovering:ident) => {{
        if *$hovering != None {
            *$hovering = None;
            $sensor.dirty = true;
        }
    }};
}

new_key_type! { pub struct CardKey; }

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
    pub fn new_inner(board_color: String, cards: Vec<Card>, sensor: Option<Sensor>) -> Self {
        // Convert to a map.
        let mut cards_map = SlotMap::with_capacity_and_key(cards.len());
        for card in cards {
            cards_map.insert(card);
        }
        let mut s = Self {
            cards: cards_map,
            sensor,
            t_msec: 0,
            board_color,
            pointer: Pointer::default(),
            id: Uuid::new_v4(),
        };
        s.set_pointer(0, 0);
        s
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
        let mut cards = vec![];
        Card::extract_cards(card, &mut cards)?;
        let sensor = SensorType::extract(sensor.as_borrowed())?.map(Sensor::from);
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
    
    pub fn set_hovering(&mut self, id: &str, hover: bool) {
        // Set the hovering state.
        if let Some(sensor) = self.sensor.as_mut() {
            match &mut sensor.sensor_type {
                SensorType::Select { cards, hovering } => {
                    match cards.iter().find(|(_, card)| card.region.contains(self.pointer.x, self.pointer.y)) {
                        Some((k, _)) => start_hovering!(sensor, hovering, k),
                        None => stop_hovering!(sensor, hovering),
                    }
                }
                SensorType::MultiSelect {
                    cards,
                    hovering,
                    selected: _,
                    confirm: _,
                } => {
                    match cards
                        .iter()
                        .find(|(_, card)| card.card.region.contains(x, y))
                    {
                        Some((k, _)) => start_hovering!(sensor, hovering, k),
                        None => stop_hovering!(sensor, hovering),
                    }
                }
                _ => (),
            }
        }
    }

    /// Select a MultiSelectSensor's card.
    ///
    /// For SelectSensor, this fails silently because the render state wouldn't change.
    /// For MultiSelectSensor, this adds `choice` the sensor isn't a SelectSensor or MultiSelectSensor.o
    pub fn select(&mut self, choice: String) -> PyResult<()> {
        match self.sensor.as_mut() {
            Some(sensor) => match &mut sensor.sensor_type {
                // No need to render anything.
                SensorType::Select {
                    cards: _,
                    hovering: _,
                } => Ok(()),
                SensorType::MultiSelect {
                    cards,
                    hovering: _,
                    selected,
                    confirm: _,
                } => {
                    selected.clear();
                    for (k, _) in cards.iter().filter(|(_, card)| card.choice == choice) {
                        selected.insert(k, ());
                    }
                    Ok(())
                }
                _ => Err(PyValueError::new_err(
                    "Failed to find a SelectSensor or MultiSelectSensor.",
                )),
            },
            None => Self::invalid_sensor(),
        }
    }

    /// Deselect a MultiSelectSensor's card.
    ///
    /// Throws an exception if the sensor isn't a MultiSelectSensor.
    pub fn deselect(&mut self, choice: String) -> PyResult<()> {
        match self.sensor.as_mut() {
            Some(sensor) => match &mut sensor.sensor_type {
                SensorType::MultiSelect {
                    cards,
                    hovering: _,
                    selected,
                    confirm: _,
                } => {
                    let keys = cards
                        .iter()
                        .filter_map(
                            |(k, card)| {
                                if card.choice == choice { Some(k) } else { None }
                            },
                        )
                        .collect::<Vec<SelectableCardKey>>();
                    selected.retain(|key, _| keys.contains(&key));
                    Ok(())
                }
                _ => Err(PyValueError::new_err("Failed to find a MultiSelectSensor.")),
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
                if let SensorType::TextEntry(text_entry) = &mut sensor.sensor_type {
                    text_entry.text = text;
                    sensor.dirty = true;
                    Ok(())
                } else {
                    Err(PyValueError::new_err("Failed to find a TextEntrySensor."))
                }
            }
            None => Self::invalid_sensor(),
        }
    }
}
