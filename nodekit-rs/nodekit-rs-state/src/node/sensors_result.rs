use hashbrown::HashMap;
use crate::SensorKey;
use crate::systems::Sensors;

pub struct SensorsResult {
    pub sensors: Sensors,
    pub sensor_ids: HashMap<String, SensorKey>,
}
