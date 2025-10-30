use crate::components::*;
use slotmap::SlotMap;

#[derive(Default)]
pub struct Effects(SlotMap<EffectKey, Effect>);
