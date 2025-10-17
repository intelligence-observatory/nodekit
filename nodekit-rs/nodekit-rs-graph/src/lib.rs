mod components;
mod node;
mod systems;
mod transition;

use crate::node::ReturnedNode;
pub use components::*;
use hashbrown::HashMap;
pub use node::{Node, NodeKey};
use slotmap::{SecondaryMap, SlotMap};
pub use transition::Transition;

/// An ECS-ish representation of a `nodekit` graph.
/// The data is laid out very differently than in the Python library
/// so that Rust can efficiently query and update.
/// In the Python library, IDs of elements are strings.
/// In `Graph`, IDs of elements are `slotmap` keys.
/// No hashmaps, just very fast SlotMaps and slightly less fast SecondaryMaps.
pub struct Graph {
    pub start: NodeKey,
    pub nodes: SlotMap<NodeKey, Node>,
    pub transitions: SecondaryMap<NodeKey, Transition>,
    pub nodekit_version: String,
}

impl Graph {
    pub fn deserialize(graph: nodekit_rs_fb::Graph<'_>) -> Option<Self> {
        let start = graph.start()?;
        let nodekit_version = graph.nodekit_version()?.to_string();
        let mut nodes = SlotMap::default();
        let mut node_ids = HashMap::default();
        let mut sensor_ids: HashMap<String, SensorKey> = HashMap::default();
        for node in graph.nodes()? {
            let node = ReturnedNode::from(&node);
            let key = nodes.insert(node.node);
            node_ids.insert(node.id.to_string(), key);
            for (k, v) in node.sensor_ids.into_iter() {
                sensor_ids.insert(k.to_string(), v);
            }
        }
        let mut transitions = SecondaryMap::default();
        for transition in graph.transitions()? {
            if let Some((node_key, transition)) =
                Transition::new(&transition, &node_ids, &sensor_ids)
            {
                transitions.insert(node_key, transition);
            }
        }
        let start = node_ids[start];
        Some(Self {
            start,
            nodes,
            transitions,
            nodekit_version,
        })
    }
}
