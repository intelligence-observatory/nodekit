use nodekit_rs_visual::VisualFrame;
use crate::components::{EntityState, SensorKey};
use nodekit_rs_audio::AudioFrame;

#[derive(Default)]
pub struct TickResult {
    pub visual: Option<VisualFrame>,
    pub audio: Option<AudioFrame>,
    pub sensor: Option<SensorKey>,
    pub state: EntityState,
}

impl TickResult {
    pub const fn finished() -> Self {
        Self {
            visual: None,
            audio: None,
            sensor: None,
            state: EntityState::Finished,
        }
    }
}
