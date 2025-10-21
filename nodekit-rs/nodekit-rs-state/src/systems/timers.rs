use crate::components::*;
use slotmap::SlotMap;

pub struct Timers(SlotMap<TimerKey, Timer>);
