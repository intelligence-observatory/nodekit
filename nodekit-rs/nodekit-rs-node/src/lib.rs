mod entity;
mod components;

use blittle::{clip, PositionI, Size};
use slotmap::{SecondaryMap, SlotMap};

pub use components::*;
pub use entity::Entity;
use nodekit_rs_board::{BOARD_D, BOARD_D_F32, BOARD_D_F32_HALF};
use nodekit_rs_fb::Graph;

#[derive(Default)]
pub struct Node {
    entities: SlotMap<Entity, ()>,
    cards: SecondaryMap<Entity, Card>,
    timers: SecondaryMap<Entity, Timer>
}

impl Node {
    pub fn deserialize(&mut self, graph: Graph) {
        if let Some(cards) = graph.cards() {
            cards.iter().for_each(|card| {
                let entity = self.entities.insert(());
                self.cards.insert(entity, Card::from(&card));
                self.timers.insert(entity, Timer::from(&card));
            })
        }
    }
}