use crate::components::CardKey;
use crate::rect::Rect;
use nodekit_rs_graph::Mask;
use slotmap::new_key_type;

new_key_type! { pub struct SensorKey; }
new_key_type! { pub struct TimeoutSensorKey; }
new_key_type! { pub struct ClickSensorKey; }
new_key_type! { pub struct KeySensorKey; }
new_key_type! { pub struct SubmitSensorKey; }

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

#[derive(Default)]
pub struct ClickSensor {
    pub rect: Rect,
    pub mask: Mask,
}

impl From<&nodekit_rs_graph::ClickSensor> for ClickSensor {
    fn from(value: &nodekit_rs_graph::ClickSensor) -> Self {
        let rect = Rect::new(value.x, value.y, value.w, value.h);
        Self {
            rect,
            mask: value.mask,
        }
    }
}

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

#[derive(Default)]
pub struct SubmitSensor {
    pub submitter_id: CardKey,
    pub source_ids: Vec<CardKey>,
}
