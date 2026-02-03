use crate::card::CardKey;
use crate::sensor::enable::EnableKey;

/// A sensor that can be rendered.
pub enum GraphicalSensor {
    Slider {
        card: CardKey,
        enable: Option<EnableKey>,
    },
    TextEntry(CardKey),
}

impl GraphicalSensor {
    pub const fn card(&self) -> CardKey {
        match self {
            GraphicalSensor::TextEntry(card) => *card,
            GraphicalSensor::Slider { card, enable: _ } => *card,
        }
    }
}
