use crate::SensorKey;
use crate::systems::*;
use hashbrown::HashMap;
use slotmap::new_key_type;

new_key_type! { pub struct NodeKey; }

#[derive(Default)]
pub struct Node {
    pub cards: Cards,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: String,
}

pub struct ReturnedNode<'n> {
    pub node: Node,
    pub sensor_ids: HashMap<&'n str, SensorKey>,
    pub id: String,
}

impl<'n> From<&'n nodekit_rs_fb::Node<'n>> for ReturnedNode<'n> {
    fn from(value: &'n nodekit_rs_fb::Node<'n>) -> Self {
        let mut cards = Cards::default();
        let card_ids = cards.deserialize(value);
        let mut sensors = Sensors::default();
        let mut sensor_ids = sensors.deserialize(value);
        sensors.deserialize_late(&mut sensor_ids, &card_ids, value);

        let mut effects = Effects::default();
        effects.deserialize(value);

        let node = Node {
            cards,
            sensors,
            effects,
            board_color: value.board_color().unwrap().to_string(),
        };
        Self {
            node,
            sensor_ids,
            id: value.id().unwrap().to_string(),
        }
    }
}
