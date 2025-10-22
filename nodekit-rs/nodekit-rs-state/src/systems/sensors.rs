use crate::components::*;
use crate::systems::SubSystem;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Default)]
pub struct Sensors {
    pub sensors: SlotMap<SensorKey, Sensor>,
    pub timers: SecondaryMap<SensorKey, TimerKey>,
    pub timeout_sensors: SubSystem<TimeoutSensorKey, SensorKey, TimeoutSensor>,
    pub click_sensors: SubSystem<ClickSensorKey, SensorKey, ClickSensor>,
    pub key_sensors: SubSystem<KeySensorKey, SensorKey, KeySensor>,
    pub submit_sensors: SubSystem<SubmitSensorKey, SensorKey, SubmitSensor>,
}
