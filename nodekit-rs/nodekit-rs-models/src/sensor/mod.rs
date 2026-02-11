mod enable;
pub(crate) mod error;
mod graphical;
mod hover;
mod select;

use crate::card::{Card, CardKey, CardType, Slider, SliderOrientation, TextEntry, TextEntryGutterState};
use crate::{Region, sensor};
pub use enable::{Enable, EnableKey};
pub use graphical::GraphicalSensor;
pub use hover::Hover;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
pub use select::Select;
pub use sensor::error::CardKeyError;
use slotmap::SlotMap;

const REGION: &str = "region";
const CHOICES: &str = "choices";
const CONFIRM_BUTTON: &str = "confirm_button";

/// Sensors in nodekit-rs are described differently than in nodekit.
/// Here, there is only one sensor that can have 0-n listeners.
/// Most sensors in nodekit, e.g. ClickSensor, aren't represented in nodekit-rs.
#[derive(Default)]
pub struct Sensor {
    pub enable: Option<Enable>,
    pub hover: Option<Hover>,
    pub select: Option<Select>,
    pub graphical: Option<GraphicalSensor>,
}

impl Sensor {
    pub fn extract(
        obj: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let sensor_type = obj.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "MultiSelectSensor" => Ok(Self::extract_multi_select(obj, cards)?),
            "SelectSensor" => Ok(Self::extract_select(obj, cards)?),
            "SliderSensor" => Ok(Self::extract_slider(obj, cards)?),
            "TextEntrySensor" => Ok(Self::extract_text_entry(obj, cards)?),
            _ => Ok(Self::default()),
        }
    }

    /// Extract any cards associated with the sensor.
    fn extract_cards(
        card: Bound<'_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Vec<CardKey>> {
        let current_keys = cards.keys().collect::<Vec<CardKey>>();
        // Extract new cards.
        Card::extract_cards(Some(card), cards)?;
        // Get the keys of the cards that we just added.
        Ok(cards
            .keys()
            .filter(|k| !current_keys.contains(k))
            .collect::<Vec<CardKey>>())
    }

    /// A multi-select sensor:
    ///
    /// - Has cards that can be hovered over and selected
    /// - Has cards comprising a confirm button, which can be hovered over and enabled/disabled.
    fn extract_multi_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        // Selectable cards, and the confirm button, can be hovered over.
        let mut hover = Hover::default();
        // The confirm button is initially disabled.
        let mut enable = Enable::default();

        // Extract the confirm button.
        let confirm_button = Self::extract_cards(sensor.getattr(CONFIRM_BUTTON)?, cards)?;
        // Extract the cards constituting the confirm button.
        hover.insert(None, confirm_button.clone());
        // Disable the confirm button.
        let enable_key = enable.insert(confirm_button);

        // Create the select sensor.
        let mut select = Select::new(enable_key);

        // Get the choices.
        let choices = sensor.getattr(CHOICES)?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
            // The choice key.
            let choice = choice.extract::<String>()?;
            // Extract the cards associated with `choice`.
            let card_keys = Self::extract_cards(card, cards)?;
            // Store these as selectable and hoverable.
            select.insert(choice.clone(), card_keys.clone());
            hover.insert(Some(choice), card_keys);
        }

        Ok(Self {
            enable: Some(enable),
            graphical: None,
            hover: Some(hover),
            select: Some(select),
        })
    }

    /// A select sensor has cards that can hovered over.
    fn extract_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let mut hover = Hover::default();

        let choices = sensor.getattr(CHOICES)?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
            // The choice key.
            let choice = choice.extract::<String>()?;
            // Extract the cards associated with `choice`.
            let card_keys = Self::extract_cards(card, cards)?;
            // Store these as hoverable.
            hover.insert(Some(choice), card_keys);
        }

        Ok(Self {
            enable: None,
            graphical: None,
            hover: Some(hover),
            select: None,
        })
    }

    /// A slider has:
    ///
    /// - A renderable that is stored as a `Card` and a `GraphicalSensor`.
    /// - Optionally, a confirm button that can be hovered over and enabled/disabled.
    fn extract_slider(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let mut s = Self::default();
        // Extract the slider.
        let num_bins = sensor
            .getattr("num_bins")?
            .extract::<i64>()?
            .cast_unsigned() as usize;
        let bin_index = sensor
            .getattr("initial_bin_index")?
            .extract::<i64>()?
            .cast_unsigned() as usize;
        let show_bin_markers = sensor.getattr("show_bin_markers")?.extract::<bool>()?;
        let orientation = match sensor.getattr("orientation")?.extract::<&str>()? {
            "horizontal" => Ok(SliderOrientation::Horizontal),
            "vertical" => Ok(SliderOrientation::Vertical),
            other => Err(PyValueError::new_err(format!(
                "Invalid slider orientation: {other}"
            ))),
        }?;
        let region = Region::extract(sensor.getattr(REGION)?.as_borrowed())?;
        let card = Card {
            card_type: CardType::Slider(Slider {
                num_bins,
                bin: bin_index,
                show_bin_markers,
                orientation,
                committed: false,
            }),
            region,
            dirty: true,
        };

        // Try to extract a confirm card.
        let enable = match sensor.getattr_opt(CONFIRM_BUTTON)? {
            Some(card) => {
                let confirm_button = Self::extract_cards(card, cards)?;

                let mut hover = Hover::default();
                hover.insert(None, confirm_button.clone());
                s.hover = Some(hover);

                let mut enable = Enable::default();
                let enable_key = enable.insert(confirm_button);
                s.enable = Some(enable);
                Some(enable_key)
            }
            None => None,
        };

        s.graphical = Some(GraphicalSensor::Slider {
            card: cards.insert(card),
            confirm_button: enable,
        });
        Ok(s)
    }

    /// A text entry sensor has a renderable that is stored as a `Card` and a `GraphicalSensor`.
    fn extract_text_entry(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let prompt = sensor.getattr("prompt")?.extract::<String>()?;
        let font_size = sensor.getattr("font_size")?.extract::<i64>()?;
        let region = Region::extract(sensor.getattr(REGION)?.as_borrowed())?;
        let card = Card {
            card_type: CardType::TextEntry(TextEntry {
                prompt,
                font_size,
                text: String::default(),
                state: TextEntryGutterState::Disabled,
            }),
            region,
            dirty: false,
        };
        Ok(Self {
            enable: None,
            graphical: Some(GraphicalSensor::TextEntry(cards.insert(card))),
            hover: None,
            select: None,
        })
    }
}

#[cfg(test)]
mod tests {
    use crate::Region;
    use crate::card::{Card, CardType, JustificationHorizontal, JustificationVertical, TextCard};

    pub(crate) fn get_card(x: i64, y: i64) -> Card {
        Card {
            card_type: CardType::Text(TextCard {
                text: "Hello world".to_string(),
                font_size: 16,
                justification_horizontal: JustificationHorizontal::Left,
                justification_vertical: JustificationVertical::Center,
                text_color: "#FFFFFFFF".to_string(),
                background_color: "#000000FF".to_string(),
            }),
            region: Region {
                x,
                y,
                w: 400,
                h: 300,
                z_index: None,
            },
            dirty: false,
        }
    }
}
