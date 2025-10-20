use slotmap::new_key_type;

new_key_type! { pub struct EffectKey; }

pub enum Effect {
    HidePointerEffect,
}

impl From<&nodekit_rs_fb::Effect<'_>> for Effect {
    fn from(value: &nodekit_rs_fb::Effect) -> Self {
        match value.effect_type_type() {
            nodekit_rs_fb::EffectType::HidePointerEffect => Self::HidePointerEffect,
            other => unreachable!("Invalid effect: {}", other.0),
        }
    }
}
