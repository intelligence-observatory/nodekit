use crate::components::*;
use crate::systems::CardComponentKey;
use slotmap::{SecondaryMap, SlotMap};

pub enum SensorComponentKey {
    Click(ClickSensorKey),
    Key(KeySensorKey),
    Submit(SubmitSensorKey),
}

#[derive(Default)]
pub struct Sensors {
    pub sensors: SlotMap<SensorKey, Sensor>,
    pub timeout_sensors: SlotMap<TimeoutSensorKey, TimeoutSensor>,
    pub components: SecondaryMap<CardKey, CardComponentKey>,
    pub click_sensors: SlotMap<ClickSensorKey, ClickSensor>,
    pub key_sensors: SlotMap<KeySensorKey, KeySensor>,
    pub submit_sensors: SlotMap<SubmitSensorKey, SubmitSensor>,
}
