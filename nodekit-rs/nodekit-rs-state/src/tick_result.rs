use crate::components::{EntityState, SensorKey};

#[derive(Default)]
pub struct TickResult {
    pub board: Option<Vec<u8>>,
    pub audio: Option<Vec<u8>>,
    pub sensor: Option<SensorKey>,
    pub state: EntityState,
}
