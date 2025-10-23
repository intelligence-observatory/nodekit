use crate::components::*;
use hashbrown::HashMap;
use slotmap::SlotMap;

#[derive(Eq, PartialEq, Hash, Ord, PartialOrd)]
pub enum SensorComponentKey {
    Click(ClickSensorKey),
    Key(KeySensorKey),
    Submit(SubmitSensorKey),
    Timeout(TimeoutSensorKey),
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
        let key = self.click_sensors.iter().find_map(|(key, sensor)| {
            if sensor.rect.contains(x, y) {
                Some(key)
            } else {
                None
            }
        })?;
        Some(self.components[&SensorComponentKey::Click(key)])
    }

    pub fn on_key(&self, key: &str) -> Option<SensorKey> {
        // A tiny repair, due to how Rust and string literals fail to cooperate.
        // See comments in nodekit-rs-graph/dump_schema.py
        let key = if key == " " { "space" } else { key };
        // Now we can find the key.
        let key = self.key_sensors.iter().find_map(|(k, sensor)| {
            if sensor.key.as_str() == key {
                Some(k)
            } else {
                None
            }
        })?;
        Some(self.components[&SensorComponentKey::Key(key)])
    }
}
