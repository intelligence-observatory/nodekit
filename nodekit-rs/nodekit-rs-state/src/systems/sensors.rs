use crate::components::*;
use slotmap::SlotMap;
use crate::systems::SubSystem;

#[derive(Default)]
pub struct Sensors {
    pub sensors: SlotMap<SensorKey, ()>,
    pub timeout_sensors: SubSystem<TimeoutSensorKey, SensorKey, TimeoutSensor>,
    pub click_sensors: SubSystem<ClickSensorKey, SensorKey, ClickSensor>,
    pub key_sensors: SubSystem<KeySensorKey, SensorKey, KeySensor>,
    pub submit_sensors: SubSystem<SubmitSensorKey, SensorKey, SubmitSensor>,
}
