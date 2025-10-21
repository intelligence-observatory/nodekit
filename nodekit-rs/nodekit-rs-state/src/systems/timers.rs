use slotmap::SlotMap;
use crate::components::*;

pub struct Timers(SlotMap<TimerKey, Timer>);