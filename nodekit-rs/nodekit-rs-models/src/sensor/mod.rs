mod multi_select;
mod sensor_type;
mod slider_orientation;
mod text_entry;

pub use multi_select::*;
pub use sensor_type::{SelectableCardKey, SensorType};
pub use slider_orientation::SliderOrientation;
pub use text_entry::TextEntry;

pub struct Sensor {
    pub sensor_type: SensorType,
    pub dirty: bool,
}

impl From<SensorType> for Sensor {
    fn from(value: SensorType) -> Self {
        Self {
            sensor_type: value,
            dirty: false,
        }
    }
}
