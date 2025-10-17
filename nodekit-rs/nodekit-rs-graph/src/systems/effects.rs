use crate::{components::*, deserialize_system};
use slotmap::SlotMap;

#[derive(Default)]
pub struct Effects {
    pub effects: SlotMap<EffectKey, Effect>,
    pub timers: SlotMap<EffectKey, Timer>,
}
impl Effects {
    deserialize_system!(EffectKey, effect);

    fn deserialize_effect<'c>(
        &mut self,
        effect: &nodekit_rs_fb::Effect<'c>,
    ) -> (&'c str, EffectKey) {
        let mut timer = Timer::from(effect.timer().unwrap());
        if let Some(hide_pointer) = effect.effect_type_as_hide_pointer_effect() {
            timer.t1 = Some(hide_pointer.end_msec().unsigned_abs());
        }
        let key = self.effects.insert(Effect::from(effect));
        (effect.id().unwrap(), key)
    }
}
