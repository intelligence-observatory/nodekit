use crate::card::CardKey;
use crate::sensor::enable::EnableKey;

/// A sensor that can be rendered.
pub enum GraphicalSensor {
    Slider {
        /// The slider card key.
        card: CardKey,
        /// The key to enabling or disabling the confirm button.
        confirm_button: Option<EnableKey>,
    },
    TextEntry(CardKey),
}

impl GraphicalSensor {
    pub const fn card(&self) -> CardKey {
        match self {
            GraphicalSensor::TextEntry(card) => *card,
            GraphicalSensor::Slider {
                card,
                confirm_button: _,
            } => *card,
        }
    }
}
