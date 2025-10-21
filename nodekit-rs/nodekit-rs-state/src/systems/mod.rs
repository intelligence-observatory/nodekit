mod cards;
mod effects;
mod sensors;
mod timers;

use slotmap::{Key, SecondaryMap, SlotMap};
pub use cards::Cards;
pub use effects::Effects;
pub use sensors::Sensors;
use crate::components::CardKey;

#[derive(Default)]
pub struct SubSystem<T: Key, U: Key, V> {
    pub components: SlotMap<T, V>,
    pub entities: SecondaryMap<T, U>
}