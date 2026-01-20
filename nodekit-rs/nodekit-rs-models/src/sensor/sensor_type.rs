use super::slider_orientation::SliderOrientation;
use crate::sensor::multi_select::MultiSelectCard;
use crate::sensor::text_entry::TextEntry;
use crate::{Card, Region};
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
use slotmap::{SecondaryMap, SlotMap, new_key_type};

new_key_type! { pub struct MultiSelectCardKey; }
new_key_type! { pub struct SelectableCardKey; }
new_key_type! { pub struct MultiSelectConfirmCardKey; }

pub enum SensorType {
    MultiSelect {
        cards: SlotMap<MultiSelectCardKey, MultiSelectCard>,
        hovering: Option<MultiSelectCardKey>,
        selected: SecondaryMap<MultiSelectCardKey, ()>,
        confirm: SlotMap<MultiSelectConfirmCardKey, Card>,
    },
    Select {
        cards: SlotMap<SelectableCardKey, Card>,
        hovering: Option<SelectableCardKey>,
    },
    Slider {
        num_bins: usize,
        bin: usize,
        show_bin_markers: bool,
        orientation: SliderOrientation,
        region: Region,
    },
    TextEntry(TextEntry),
}

impl SensorType {
    pub fn extract(obj: Borrowed<'_, '_, PyAny>) -> PyResult<Option<Self>> {
        let sensor_type = obj.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "MultiSelectSensor" => Ok(Self::extract_multi_select(obj).ok()),
            "SelectSensor" => Ok(Self::extract_select(obj).ok()),
            "SliderSensor" => Ok(Self::extract_slider(obj).ok()),
            "TextEntrySensor" => Ok(Self::extract_text_entry(obj).ok()),
            _ => Ok(None),
        }
    }

    fn extract_multi_select(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let mut confirm_cards = Vec::default();
        Card::extract_cards(sensor.getattr("confirm_button")?, &mut confirm_cards)?;
        let mut confirm = SlotMap::with_capacity_and_key(confirm_cards.len());
        for c in confirm_cards {
            confirm.insert(c);
        }

        let choices = sensor.getattr("choices")?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        let mut cards = SlotMap::default();
        for (card_id, card) in choices {
            let choice = card_id.extract::<String>()?;
            let mut cs = Vec::default();
            Card::extract_cards(card, &mut cs)?;
            for card in cs {
                cards.insert(MultiSelectCard {
                    choice: choice.clone(),
                    card,
                });
            }
        }

        Ok(Self::MultiSelect {
            cards,
            hovering: None,
            selected: SecondaryMap::default(),
            confirm,
        })
    }

    fn extract_select(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let choices = sensor.getattr("choices")?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        let mut cards = SlotMap::default();
        for card in choices.values() {
            let mut cs = Vec::default();
            Card::extract_cards(card, &mut cs)?;
            for card in cs {
                cards.insert(card);
            }
        }
        Ok(Self::Select {
            cards,
            hovering: None,
        })
    }

    fn extract_slider(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
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
        Ok(Self::Slider {
            num_bins,
            bin: bin_index,
            show_bin_markers,
            orientation,
            region,
        })
    }

    fn extract_text_entry(sensor: Borrowed<'_, '_, PyAny>) -> PyResult<Self> {
        let prompt = sensor.getattr("prompt")?.extract::<String>()?;
        let font_size = sensor.getattr("font_size")?.extract::<i64>()?;
        let region = Region::extract(sensor)?;
        Ok(Self::TextEntry(TextEntry {
            prompt,
            font_size,
            text: String::default(),
            region,
        }))
    }
}
