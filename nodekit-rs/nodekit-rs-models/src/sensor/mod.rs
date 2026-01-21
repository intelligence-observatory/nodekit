mod hover;
mod select;
mod sensor_type;
pub(crate) mod error;

pub use hover::Hover;
pub use select::Select;
pub use sensor_type::SensorType;

pub struct Sensor {
    /// Per-sensor definitions and mappings.
    pub sensor_type: SensorType,
    /// If true, the sensor needs to be re-rendered.
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
