mod components;
mod error;
mod node;
mod rect;
mod systems;
mod transition;

use crate::node::{Node, NodeKey};
use crate::transition::Transition;
use error::Error;
use nodekit_rs_board::BOARD_D;
use nodekit_rs_graph::Graph;
use slotmap::{SecondaryMap, SlotMap};
use std::collections::HashMap;
use std::path::Path;

pub struct State<'s> {
    pub start: NodeKey,
    pub current: NodeKey,
    pub nodes: SlotMap<NodeKey, Node<'s>>,
    pub transitions: SecondaryMap<NodeKey, Transition>,
    pub nodekit_version: String,
    pub board: Vec<u8>,
}

impl<'s> State<'s> {
    pub fn new<P: AsRef<Path>>(value: &'s Graph, directory: P) -> Result<Self, Error> {
        let mut node_ids: HashMap<&String, NodeKey> = HashMap::default();
        let mut nodes = SlotMap::default();
        let mut sensor_ids = SecondaryMap::default();
        // Add nodes.
        for (node_id, node) in value.nodes.iter() {
            let returned_node = Node::from_node(node, directory.as_ref())?;
            let node_key = nodes.insert(returned_node.node);
            sensor_ids.insert(node_key, returned_node.sensor_ids);
            node_ids.insert(node_id, node_key);
        }
        // Add transitions.
        let mut transitions = SecondaryMap::default();
        for (to, raw_transitions) in value.transitions.iter() {
            for (from, sensor_id) in raw_transitions.iter() {
                let to = node_ids[to];
                let from = node_ids[from];
                let sensor = sensor_ids[from][sensor_id];
                transitions.insert(to, Transition { from, sensor });
            }
        }
        let start = node_ids[&value.start];

        Ok(Self {
            start,
            current: start,
            nodes,
            transitions,
            nodekit_version: value.nodekit_version.clone(),
            board: vec![0; BOARD_D * BOARD_D * 3],
        })
    }
    
    pub fn tick(&mut self) {
        let node = &mut self.nodes[self.current];
        node.tick();
    }
}
