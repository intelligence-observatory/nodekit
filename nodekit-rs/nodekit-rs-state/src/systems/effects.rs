use crate::components::*;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Default)]
pub struct Effects {
    pub effects: SlotMap<EffectKey, EntityState>,
    pub hide_pointer_effects: SlotMap<HidePointerEffectKey, ()>,
    pub components: SecondaryMap<HidePointerEffectKey, EffectKey>,
}
