mod board;
mod components;
mod error;
mod node;
mod rect;
mod systems;
mod tick_result;

pub use crate::components::*;
use crate::node::{Node, NodeKey};
use board::*;
use error::Error;
use nodekit_rs_graph::Graph;
use slotmap::{SecondaryMap, SlotMap};
use std::collections::HashMap;
use std::path::Path;
use nodekit_rs_action::Action;
pub use tick_result::TickResult;

pub struct State {
    pub start: NodeKey,
    current: NodeKey,
    pub nodes: SlotMap<NodeKey, Node>,
    pub transitions: SecondaryMap<NodeKey, SecondaryMap<SensorKey, NodeKey>>,
    pub nodekit_version: String,
    pub board: Vec<u8>,
    finished: bool,
}

impl State {
    pub fn new<P: AsRef<Path>>(value: Graph, directory: P) -> Result<Self, Error> {
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
        for (from, raw_transitions) in value.transitions.iter() {
            let mut map = SecondaryMap::default();
            let from = node_ids[from];
            for (sensor_id, to) in raw_transitions.iter() {
                let to = node_ids[to];
                let sensor = sensor_ids[from][sensor_id];
                map.insert(sensor, to);
            }
            transitions.insert(from, map);
        }
        let start = node_ids[&value.start];

        Ok(Self {
            start,
            current: start,
            nodes,
            transitions,
            nodekit_version: value.nodekit_version.clone(),
            board: board(),
            finished: false,
        })
    }

    pub fn current_node(&mut self) -> &mut Node {
        &mut self.nodes[self.current]
    }

    pub fn tick(&mut self, action: Option<Action>) -> Result<TickResult, Error> {
        if self.finished {
            Ok(TickResult::finished())
        } else {
            let result = self.nodes[self.current].tick(action, &mut self.board)?;
            // This node ended. Try to get the next node.
            if result.state == EntityState::EndedNow {
                match result.sensor {
                    Some(sensor) => {
                        self.current = self.transitions[self.current][sensor];
                        Ok(result)
                    }
                    None => {
                        self.finished = true;
                        Ok(TickResult::finished())
                    }
                }
            } else {
                Ok(result)
            }
        }
    }
}
