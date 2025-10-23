use slotmap::new_key_type;
use crate::CardKey;

new_key_type! { pub struct SubmitSensorKey; }

#[derive(Default)]
pub struct SubmitSensor {
    pub submitter_key: CardKey,
    pub source_keys: Vec<CardKey>,
}