use crate::{CardKey, fb_enum};
use slotmap::new_key_type;

new_key_type! { pub struct SensorKey; }

pub struct TimeoutSensor(u32);

impl<'t> From<nodekit_rs_fb::TimeoutSensor<'t>> for TimeoutSensor {
    fn from(value: nodekit_rs_fb::TimeoutSensor) -> Self {
        Self(value.timeout_msec().unsigned_abs())
    }
}

fb_enum!(ClickSensorMask, "click sensor mask", Rectangle);

pub struct ClickSensor {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
    pub mask: ClickSensorMask,
}

impl From<nodekit_rs_fb::ClickSensor<'_>> for ClickSensor {
    fn from(value: nodekit_rs_fb::ClickSensor) -> Self {
        Self {
            x: value.x(),
            y: value.y(),
            w: value.w(),
            h: value.h(),
            mask: ClickSensorMask::from(value.mask()),
        }
    }
}

pub struct KeySensor {
    pub key: String,
}

impl From<nodekit_rs_fb::KeySensor<'_>> for KeySensor {
    fn from(value: nodekit_rs_fb::KeySensor) -> Self {
        Self {
            key: value.key().unwrap().to_string(),
        }
    }
}

pub struct SubmitSensor {
    pub submitter_id: CardKey,
    pub source_ids: Vec<CardKey>,
}
