mod enable;
pub(crate) mod error;
mod graphical;
mod hover;
mod select;

use crate::Region;
use crate::card::{Card, CardKey, CardType, Slider, SliderOrientation, TextEntry};
use enable::Enable;
pub use graphical::GraphicalSensor;
pub use hover::Hover;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyString};
pub use select::Select;
use slotmap::SlotMap;

const CHOICES: &str = "choices";
const CONFIRM_BUTTON: &str = "confirm_button";

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

    /// Returns the keys of cards that are being hovered over,
    /// or none if there isn't a hovering listener.
    pub fn get_hovering_over(&self) -> Option<&Vec<CardKey>> {
        self.hover
            .as_ref()
            .and_then(|hover| hover.get_hovering_over())
    }

    /// Returns the keys of cards that are selected,
    /// or none if there isn't a selection listener.
    pub fn get_selected(&self) -> Option<Vec<CardKey>> {
        self.select.as_ref().map(|select| select.get_selected())
    }

    fn extract_cards(
        card: Bound<'_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Vec<CardKey>> {
        let current_keys = cards.keys().collect::<Vec<CardKey>>();
        // Extract new cards.
        Card::extract_cards(card, cards)?;
        // Get the keys of the cards that we just added.
        Ok(cards
            .keys()
            .filter(|k| !current_keys.contains(k))
            .collect::<Vec<CardKey>>())
    }

    fn extract_multi_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let mut hover = Hover::default();
        let mut select = Select::default();

        // Extract the cards constituting the confirm button.
        hover
            .cards
            .insert(Self::extract_cards(sensor.getattr(CONFIRM_BUTTON)?, cards)?);

        let choices = sensor.getattr(CHOICES)?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
            // The child key.
            let choice = choice.extract::<String>()?;
            let card_keys = Self::extract_cards(card, cards)?;
            // Store these as selectable and hoverable.
            select.choices.insert(choice.clone(), card_keys.clone());
            let hover_key = hover.cards.insert(card_keys);
            hover.choices.insert(choice.clone(), hover_key);
        }

        Ok(Self {
            enable: None,
            graphical: None,
            hover: Some(hover),
            select: Some(select),
        })
    }

    fn extract_select(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let mut hover = Hover::default();

        let choices = sensor.getattr(CHOICES)?;
        let choices: &Bound<PyDict> = choices.cast::<PyDict>()?;
        for (choice, card) in choices {
            // The child key.
            let choice = choice.extract::<String>()?;
            let card_keys = Self::extract_cards(card, cards)?;
            // Store these as selectable and hoverable.
            let hover_key = hover.cards.insert(card_keys);
            hover.choices.insert(choice.clone(), hover_key);
        }

        Ok(Self {
            enable: None,
            graphical: None,
            hover: Some(hover),
            select: None,
        })
    }

    fn extract_slider(
        sensor: Borrowed<'_, '_, PyAny>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> PyResult<Self> {
        let mut s = Self::default();
        // Extract the sensor.
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
                committed: false,
            }),
            region,
            dirty: false,
        };

        // Try to extract a confirm card.
        let enable = match sensor.getattr_opt(CONFIRM_BUTTON)? {
            Some(card) => {
                let confirm_button = Self::extract_cards(card, cards)?;
                let mut hover = Hover::default();
                hover.cards.insert(confirm_button.clone());
                let mut enable = Enable::default();
                let enable_key = enable.insert(confirm_button);
                s.hover = Some(hover);
                s.enable = Some(enable);
                Some(enable_key)
            }
            None => None,
        };

        s.graphical = Some(GraphicalSensor::Slider {
            card: cards.insert(card),
            enable,
        });
        Ok(s)
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
