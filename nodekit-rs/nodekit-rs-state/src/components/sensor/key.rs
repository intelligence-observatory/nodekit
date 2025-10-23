use slotmap::new_key_type;

new_key_type! { pub struct KeySensorKey; }

#[derive(Default)]
pub struct KeySensor {
    pub key: String,
}

impl From<&nodekit_rs_graph::KeySensor> for KeySensor {
    fn from(value: &nodekit_rs_graph::KeySensor) -> Self {
        Self {
            key: value.key.to_string(),
        }
    }
}
