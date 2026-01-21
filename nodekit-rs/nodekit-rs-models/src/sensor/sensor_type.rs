use super::{hover::Hover, select::Select};
use crate::{Region, card::*};
use hashbrown::{HashMap, HashSet};
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
use slotmap::SlotMap;

pub enum SensorType {
    Select(Select),
    Hover(Hover),
    Slider(CardKey),
    TextEntry(CardKey),
}

impl SensorType {
    pub fn extract(
        obj: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Option<Self>> {
        let sensor_type = obj.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "MultiSelectSensor" => Ok(Self::extract_multi_select(obj, cards).ok()),
            "SelectSensor" => Ok(Self::extract_select(obj, cards).ok()),
            "SliderSensor" => Ok(Self::extract_slider(obj, cards).ok()),
            "TextEntrySensor" => Ok(Self::extract_text_entry(obj, cards).ok()),
            _ => Ok(None),
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
        let region = Region::extract(sensor)?;
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

        let current_keys = cards.keys().collect::<Vec<CardKey>>();

        let choices = sensor.getattr("choices")?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
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
            hoverable,
            hovering: None,
        })
    }
}
