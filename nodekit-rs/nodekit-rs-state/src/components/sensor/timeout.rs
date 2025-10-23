use slotmap::new_key_type;

new_key_type! { pub struct TimeoutSensorKey; }

#[derive(Default)]
pub struct TimeoutSensor {
    t: u64,
    t1: u64,
}

impl From<&nodekit_rs_graph::TimeoutSensor> for TimeoutSensor {
    fn from(value: &nodekit_rs_graph::TimeoutSensor) -> Self {
        Self {
            t: 0,
            t1: value.timeout_msec.get(),
        }
    }
}