use crate::components::*;
use crate::deserialize_system;
use hashbrown::HashMap;
use nodekit_rs_fb::{Node, SensorType, TemporallyBoundedSensorType};
use slotmap::{SecondaryMap, SlotMap};

#[derive(Default)]
pub struct Sensors {
    pub sensors: SlotMap<SensorKey, ()>,
    pub timeout_sensors: SecondaryMap<SensorKey, TimeoutSensor>,
    pub click_sensors: SecondaryMap<SensorKey, ClickSensor>,
    pub key_sensors: SecondaryMap<SensorKey, KeySensor>,
    pub submit_sensors: SecondaryMap<SensorKey, SubmitSensor>,
}

impl Sensors {
    deserialize_system!(SensorKey, sensor);

    pub fn deserialize_late<'s>(
        &mut self,
        sensor_ids: &mut HashMap<&'s str, SensorKey>,
        card_ids: &HashMap<&str, CardKey>,
        node: &'s Node,
    ) -> Option<()> {
        let mut submit_sensors = SecondaryMap::default();
        for (id, submit_sensor) in node.sensors()?.iter().filter_map(|sensor| {
            Some((
                sensor.id()?,
                sensor
                    .sensor_type_as_temporally_bounded_sensor()?
                    .sensor_as_submit_sensor()?,
            ))
        }) {
            let submitter_id = card_ids[submit_sensor.submitter_id()?];
            let source_ids = submit_sensor
                .source_ids()?
                .iter()
                .map(|id| card_ids[id])
                .collect::<Vec<CardKey>>();
            let sensor_key = self.sensors.insert(());
            sensor_ids.insert(id, sensor_key);
            submit_sensors.insert(
                sensor_key,
                SubmitSensor {
                    submitter_id,
                    source_ids,
                },
            );
        }
        Some(())
    }

    fn deserialize_sensor<'s>(
        &mut self,
        sensor: &nodekit_rs_fb::Sensor<'s>,
    ) -> (&'s str, SensorKey) {
        let key = self.sensors.insert(());
        match sensor.sensor_type_type() {
            SensorType::TimeoutSensor => {
                self.timeout_sensors.insert(
                    key,
                    TimeoutSensor::from(sensor.sensor_type_as_timeout_sensor().unwrap()),
                );
            }
            SensorType::TemporallyBoundedSensor => {
                let temporal_sensor = sensor.sensor_type_as_temporally_bounded_sensor().unwrap();
                match temporal_sensor.sensor_type() {
                    TemporallyBoundedSensorType::ClickSensor => {
                        self.click_sensors.insert(
                            key,
                            ClickSensor::from(temporal_sensor.sensor_as_click_sensor().unwrap()),
                        );
                    }
                    TemporallyBoundedSensorType::KeySensor => {
                        self.key_sensors.insert(
                            key,
                            KeySensor::from(temporal_sensor.sensor_as_key_sensor().unwrap()),
                        );
                    }
                    // We'll do this elsewhere.
                    TemporallyBoundedSensorType::SubmitSensor => (),
                    other => unreachable!("Invalid temporally bounded sensor type: {}", other.0),
                }
            }
            other => unreachable!("Invalid sensor type: {}", other.0),
        }
        (sensor.id().unwrap(), key)
    }
}
