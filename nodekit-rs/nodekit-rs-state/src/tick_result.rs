use crate::components::{BlitResult, SensorKey};

#[derive(Default)]
pub struct TickResult {
    pub blit: BlitResult,
    pub sensor_triggered: Option<SensorKey>,
}
