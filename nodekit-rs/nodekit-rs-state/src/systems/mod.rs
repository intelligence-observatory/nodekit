mod assets;
mod cards;
mod effects;
mod sensors;
mod timers;

pub use assets::Assets;
pub use cards::Cards;
pub use effects::Effects;
pub use sensors::Sensors;
use slotmap::{Key, SecondaryMap, SlotMap};
pub use timers::Timers;

#[derive(Default)]
pub struct SubSystem<T: Key, U: Key, V> {
    pub components: SlotMap<T, V>,
    pub entities: SecondaryMap<T, U>,
}
