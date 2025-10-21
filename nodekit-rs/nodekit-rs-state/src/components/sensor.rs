use slotmap::new_key_type;
use crate::components::CardKey;

new_key_type! { pub struct SensorKey; }
new_key_type! { pub struct TimeoutSensorKey; }
new_key_type! { pub struct ClickSensorKey; }
new_key_type! { pub struct KeySensorKey; }
new_key_type! { pub struct SubmitSensorKey; }

#[derive(Default)]
pub struct TimeoutSensor(u32);

#[derive(Default)]
pub enum ClickSensorMask {
    #[default]
    Rectangle,
    Ellipse
}

#[derive(Default)]
pub struct ClickSensor {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
    pub mask: ClickSensorMask,
}

#[derive(Default)]
pub struct KeySensor {
    pub key: String,
}

#[derive(Default)]
pub struct SubmitSensor {
    pub submitter_id: CardKey,
    pub source_ids: Vec<CardKey>,
}
