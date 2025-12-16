mod slider;
mod text_entry;
mod sensor_type;

use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList, PyString};
use pyo3_stub_gen::derive::gen_stub_pyclass;
pub use slider::*;
pub use text_entry::*;
use crate::{Card, CardType, Region};
use crate::sensor::sensor_type::SensorType;

#[gen_stub_pyclass]
#[pyclass]
pub struct Sensor {
    /// The ID of the sensor.
    /// The root sensor doesn't have an ID.
    #[pyo3(get)]
    pub id: Option<String>
}

impl Sensor {
    fn extract_sensor(sensor: Bound<'_, PyAny>) -> PyResult<Option<(SensorType, Card)>> {
        let sensor_type = sensor.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "SliderSensor" => {
                let slider = Slider::extract(sensor.as_borrowed())?;
                let region = Region::extract(sensor.getattr("region")?.as_borrowed())?;
                Ok(Some((SensorType::Slider, Card {
                    card_type: CardType::Slider(slider),
                    region,
                    dirty: false
                })))
            },
            "TextEntrySensor" => {
                let text_entry = TextEntry::extract(sensor.as_borrowed())?;
                let region = Region::extract(sensor.getattr("region")?.as_borrowed())?;
                Ok(Some((SensorType::TextEntry, Card {
                    card_type: CardType::TextEntry(text_entry),
                    region,
                    dirty: false
                })))
            }
            _ => Ok(None)
        }
    }

    /// Extract `obj` into a flat vec of `Card`s.
    pub fn extract_all(sensor: &Bound<'_, PyAny>) -> PyResult<Vec<Self>> {
        let mut cards = Vec::default();
        for cs in obj.iter().map(|item| Self::extract_card(item)) {
            cards.append(&mut cs?);
        }
        // Set the rendering order.
        cards.sort_by(|a, b| a.region.z_index.cmp(&b.region.z_index));
        Ok(cards)
    }

    /// Extract an item in a list of cards.
    /// The item might be a nested composite card.
    fn extract_item(item: Bound<'_, PyAny>) -> PyResult<Vec<Self>> {
        let mut sensors = Vec::default();
        let sensor_type = item.getattr("sensor_type")?;
        match sensor_type.cast::<PyString>()?.to_str()? {
            "ProductSensor" | "SumSensor" => {

            }
            _ => sensors.push(Self::extract_sensor(item)?);
        }
        // Extract a composite card's children.
        if item.getattr(crate::card::CARD_TYPE)?.cast::<PyString>()? == "CompositeCard" {
            // Recurse until we get single cards.
            for item in item
                .getattr("children")?
                .cast::<PyDict>()?
                .iter()
                .map(|(_, v)| Self::extract_card(v))
            {
                cards.append(&mut item?);
            }
        } else {
            // Extract a single card.
            cards.push(Card::extract(item.as_borrowed())?);
        }
        Ok(cards)
    }
}