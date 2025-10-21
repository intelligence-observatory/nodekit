use crate::components::*;
use slotmap::SlotMap;

#[derive(Default)]
pub struct Timers(pub SlotMap<TimerKey, Timer>);
