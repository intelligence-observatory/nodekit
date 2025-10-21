use crate::{components::*};
use slotmap::SlotMap;

#[derive(Default)]
pub struct Effects {
    pub effects: SlotMap<EffectKey, Effect>,
    pub timers: SlotMap<EffectKey, Timer>,
}
