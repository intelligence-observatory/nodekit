pub(crate) mod error;
mod hover;
mod select;

use crate::Region;
use crate::card::{Card, CardKey, CardType, Slider, SliderOrientation, TextEntry};
use hashbrown::{HashMap, HashSet};
pub use hover::Hover;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
pub use select::Select;
use slotmap::SlotMap;

pub enum Sensor {
    /// Wrapper for MultiSelectSensor that includes hovering and selecting.
    Select(Select),
    /// Wrapper for SelectSensor that includes hovering.
    Hover(Hover),
    /// The card key for a Slider.
    Slider(CardKey),
    /// The card key for a TextEntry.
    TextEntry(CardKey),
}

impl Sensor {
    pub fn extract(
        obj: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Option<Self>> {
        let sensor_type = obj.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "MultiSelectSensor" => Ok(Some(Self::extract_multi_select(obj, cards)?)),
            "SelectSensor" => Ok(Some(Self::extract_select(obj, cards)?)),
            "SliderSensor" => Ok(Some(Self::extract_slider(obj, cards)?)),
            "TextEntrySensor" => Ok(Some(Self::extract_text_entry(obj, cards)?)),
            _ => Ok(None),
        }
    }

    /// Returns the keys of cards that are being hovered over,
    /// or none if there isn't a hovering listener.
    pub fn get_hovering_over(&self) -> Option<&Vec<CardKey>> {
        match self {
            Self::Hover(hover) => hover.get_hovering_over(),
            Self::Select(select) => select.hover.get_hovering_over(),
            _ => None,
        }
    }

    /// Returns the keys of cards that are selected,
    /// or none if there isn't a selection listener.
    pub fn get_selected(&self) -> Option<Vec<CardKey>> {
        match self {
            Self::Select(select) => Some(select.get_selected()),
            _ => None,
        }
    }

    fn extract_multi_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        // Extract the cards constituting the confirm button.
        Card::extract_cards(sensor.getattr("confirm_button")?, cards)?;
        // Extract hoverables.
        let hover = Self::extract_hover(sensor, cards)?;
        Ok(Self::Select(Select {
            hover,
            selected: HashSet::default(),
        }))
    }

    fn extract_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        Ok(Self::Hover(Self::extract_hover(sensor, cards)?))
    }

    fn extract_slider(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
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
        let region = Region::extract(sensor)?;
        let card = Card {
            card_type: CardType::Slider(Slider {
                num_bins,
                bin: bin_index,
                show_bin_markers,
                orientation,
            }),
            region,
            dirty: false,
        };
        let slider = cards.insert(card);
        Ok(Self::Slider(slider))
    }

    fn extract_text_entry(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let prompt = sensor.getattr("prompt")?.extract::<String>()?;
        let font_size = sensor.getattr("font_size")?.extract::<i64>()?;
        let region = Region::extract(sensor.getattr("region")?.as_borrowed())?;
        let card = Card {
            card_type: CardType::TextEntry(TextEntry {
                prompt,
                font_size,
                text: String::default(),
            }),
            region,
            dirty: false,
        };
        // Add a text entry card.
        let text_entry = cards.insert(card);
        Ok(Self::TextEntry(text_entry))
    }

    fn extract_hover(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Hover> {
        let mut hoverable = HashMap::default();

        let choices = sensor.getattr("choices")?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
            let current_keys = cards.keys().collect::<Vec<CardKey>>();

            // The child key.
            let choice = choice.extract::<String>()?;
            // Extract new cards.
            Card::extract_cards(card, cards)?;
            // Get the keys of the cards that we just added.
            let new_keys = cards
                .keys()
                .filter(|k| !current_keys.contains(k))
                .collect::<Vec<CardKey>>();
            // Store these as hoverable.
            hoverable.insert(choice, new_keys);
        }

        Ok(Hover {
            hoverables: hoverable,
            hovering: None,
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
