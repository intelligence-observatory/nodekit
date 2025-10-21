use crate::components::SensorKey;
use crate::systems::*;
use hashbrown::HashMap;
use slotmap::new_key_type;

new_key_type! { pub struct NodeKey; }

#[derive(Default)]
pub struct Node<'n> {
    pub cards: Cards<'n>,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
}

pub struct ReturnedNode<'n> {
    pub node: Node<'n>,
    pub sensor_ids: HashMap<&'n str, SensorKey>,
    pub id: String,
}
