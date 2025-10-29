mod components;
mod error;
mod node;
mod rect;
mod systems;

pub use crate::components::*;
use crate::node::{Node, NodeKey};
use error::Error;
use nodekit_rs_action::Action;
use nodekit_rs_graph::Graph;
use nodekit_rs_response::Response;
use nodekit_rs_visual::{STRIDE, VISUAL_D};
use slotmap::{SecondaryMap, SlotMap};
use std::collections::HashMap;

pub struct State {
    pub start: NodeKey,
    current: NodeKey,
    pub nodes: SlotMap<NodeKey, Node>,
    pub transitions: SecondaryMap<NodeKey, SecondaryMap<SensorKey, NodeKey>>,
    pub nodekit_version: String,
    pub visual: Vec<u8>,
    finished: bool,
}

impl State {
    pub fn new(value: Graph) -> Result<Self, Error> {
        let mut node_ids: HashMap<&String, NodeKey> = HashMap::default();
        let mut nodes = SlotMap::default();
        let mut sensor_ids = SecondaryMap::default();
        // Add nodes.
        for (node_id, node) in value.nodes.iter() {
            let returned_node = Node::from_node(node)?;
            let sids = returned_node.sensors.sensor_ids.clone();
            let node_key = nodes.insert(returned_node);
            sensor_ids.insert(node_key, sids);
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
            visual: vec![0; VISUAL_D * VISUAL_D * STRIDE],
            finished: false,
        })
    }

    pub fn current_node(&mut self) -> &mut Node {
        &mut self.nodes[self.current]
    }

    pub fn tick(&mut self, action: Option<Action>) -> Result<Response, Error> {
        if self.finished {
            Ok(Response::default())
        } else {
            let response = self.nodes[self.current].tick(action, &mut self.visual)?;
            // This node ended. Try to get the next node.
            if response.ended {
                match response.sensor.as_ref() {
                    Some(sensor) => {
                        let sensor_key = self.nodes[self.current].sensors.sensor_ids[sensor];
                        self.current = self.transitions[self.current][sensor_key];
                        Ok(response)
                    }
                    None => {
                        self.finished = true;
                        Ok(Response::default())
                    }
                }
            } else {
                Ok(response)
            }
        }
    }
}
