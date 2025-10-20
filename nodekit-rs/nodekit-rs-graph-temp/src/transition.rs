use crate::{NodeKey, SensorKey};
use hashbrown::HashMap;

pub struct Transition {
    pub sensor: SensorKey,
    pub to: NodeKey,
}

impl Transition {
    pub fn new(
        transition: &nodekit_rs_fb::Transition,
        node_ids: &HashMap<String, NodeKey>,
        sensor_ids: &HashMap<String, SensorKey>,
    ) -> Option<(NodeKey, Self)> {
        let from = node_ids[transition.from()?];
        let sensor = sensor_ids[transition.sensor()?];
        let to = node_ids[transition.to()?];
        Some((from, Self { sensor, to }))
    }
}
