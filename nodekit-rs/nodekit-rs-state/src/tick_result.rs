use crate::components::{EntityState, SensorKey};

pub struct SensorResult {
    pub key: SensorKey,
    pub id: String,
}

#[derive(Default)]
pub struct TickResult {
    pub board: Option<Vec<u8>>,
    pub audio: Option<Vec<u8>>,
    pub sensor: Option<SensorResult>,
    pub state: EntityState,
}
