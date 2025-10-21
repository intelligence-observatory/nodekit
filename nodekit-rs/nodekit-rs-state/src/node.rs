use hashbrown::HashMap;
use slotmap::new_key_type;
use crate::components::SensorKey;

new_key_type! { pub struct NodeKey; }

#[derive(Default)]
pub struct Node {
    pub cards: Cards,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
}

pub struct ReturnedNode<'n> {
    pub node: Node,
    pub sensor_ids: HashMap<&'n str, SensorKey>,
    pub id: String,
}