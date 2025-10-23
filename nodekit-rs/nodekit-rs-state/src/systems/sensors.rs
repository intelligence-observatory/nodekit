use hashbrown::HashMap;
use crate::components::*;
use slotmap::SlotMap;

#[derive(Eq, PartialEq, Hash, Ord, PartialOrd)]
pub enum SensorComponentKey {
    Click(ClickSensorKey),
    Key(KeySensorKey),
    Submit(SubmitSensorKey),
}

#[derive(Default)]
pub struct Sensors {
    pub sensors: SlotMap<SensorKey, Sensor>,
    pub timeout_sensors: SlotMap<TimeoutSensorKey, TimeoutSensor>,
    pub components: HashMap<SensorComponentKey, SensorKey>,
    pub click_sensors: SlotMap<ClickSensorKey, ClickSensor>,
    pub key_sensors: SlotMap<KeySensorKey, KeySensor>,
    pub submit_sensors: SlotMap<SubmitSensorKey, SubmitSensor>,
}

impl Sensors {
    pub fn on_click(&self, x: f32, y: f32) -> Option<SensorKey> {
        let click_sensor = self.click_sensors.iter().find_map(|(key, sensor)| {
            if sensor.rect.contains(x, y) {
                Some(key)
            }
            else {
                None
            }
        })?;
        Some(self.components[&SensorComponentKey::Click(click_sensor)])
    }
}
