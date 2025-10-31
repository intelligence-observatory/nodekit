//! This crate contains the core functionality of `nodekit-rs`.
//! Everything except the socket connection routes to this crate.

mod components;
mod error;
mod node;
mod rect;
mod systems;

pub use crate::components::*;
use crate::node::{Node, NodeKey};
use error::Error;
use glam::DVec2;
use nodekit_rs_board::{STRIDE, VISUAL_D};
use nodekit_rs_graph::Graph;
use nodekit_rs_request::Action;
use nodekit_rs_response::Response;
use slotmap::{SecondaryMap, SlotMap};
use std::collections::HashMap;

/// The state of the simulator.
/// A `State` translates a `Graph` into stateful information.
/// A `State` can be updated via [`State::tick()`], which returns a `Response`.
pub struct State {
    /// The key of the current node.
    current: NodeKey,
    /// The nodes in the graph.
    nodes: SlotMap<NodeKey, Node>,
    /// The edges in the graph.
    transitions: SecondaryMap<NodeKey, SecondaryMap<SensorKey, NodeKey>>,
    /// This is sent as part of the `Response`.
    pub nodekit_version: String,
    /// An allocated visual board.
    visual: Vec<u8>,
    /// If true, the graph is done.
    finished: bool,
    cursor: DVec2,
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
            current: start,
            nodes,
            transitions,
            nodekit_version: value.nodekit_version.clone(),
            visual: vec![0; VISUAL_D * VISUAL_D * STRIDE],
            finished: false,
            cursor: DVec2::default(),
        })
    }

    pub fn tick(&mut self, action: Option<Action>) -> Result<Response, Error> {
        if self.finished {
            Ok(Response::finished())
        } else {
            let response =
                self.nodes[self.current].tick(action, &mut self.cursor, &mut self.visual)?;
            // This node ended. Try to get the next node.
            if response.finished {
                match response.sensor.as_ref() {
                    Some(sensor) => {
                        let sensor_key = self.nodes[self.current].sensors.sensor_ids[sensor];
                        self.current = self.transitions[self.current][sensor_key];
                        Ok(response)
                    }
                    None => {
                        self.finished = true;
                        Ok(Response::finished())
                    }
                }
            } else {
                Ok(response)
            }
        }
    }
}
