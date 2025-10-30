//! This crate contains the [`Request`] that the Python client sends to the simulator
//! (as a serialized byte array).
//!
//! The [`serialize`] functions are Python-facing.
//! The [`Request`] struct isn't Python-facing because there's never a need to use it there.

mod action;
mod error;
pub mod serialize;

pub use action::Action;
pub use error::Error;
use flatbuffers::size_prefixed_root;
use nodekit_rs_fb::{
    click as click_fb, graph as graph_fb, key_press as key_press_fb, noop as noop_fb,
};
use nodekit_rs_graph::Graph;
use serde_json::from_slice;

/// A deserialized sent from Python to the simulator.
pub enum Request {
    /// A deserialized `Graph`.
    Graph(Graph),
    /// Tell the simulator to advance by one tick.
    /// Optionally, send an action as well.
    Tick(Option<Action>),
}

impl Request {
    pub fn deserialize(buffer: &[u8]) -> Result<Self, Error> {
        if buffer.is_empty() {
            Ok(Self::Tick(None))
        } else {
            match size_prefixed_root::<&str>(buffer).map_err(Error::InvalidFlatbuffer)? {
                graph_fb::GRAPH_IDENTIFIER => Self::deserialize_graph(buffer),
                click_fb::CLICK_IDENTIFIER => Self::deserialize_click(buffer),
                key_press_fb::KEY_PRESS_IDENTIFIER => Self::deserialize_key_press(buffer),
                noop_fb::NOOP_IDENTIFIER => Ok(Self::Tick(None)),
                other => Err(Error::Prefix(other.to_string())),
            }
        }
    }

    fn deserialize_graph(data: &[u8]) -> Result<Self, Error> {
        let graph = graph_fb::root_as_graph(data).map_err(Error::InvalidFlatbuffer)?;
        let graph =
            from_slice::<Graph>(graph.node_graph().bytes()).map_err(Error::DeserializeGraph)?;
        Ok(Self::Graph(graph))
    }

    fn deserialize_click(data: &[u8]) -> Result<Self, Error> {
        let click = click_fb::root_as_click(data).map_err(Error::InvalidFlatbuffer)?;
        Ok(Self::Tick(Some(Action::Click {
            x: click.x(),
            y: click.y(),
        })))
    }

    fn deserialize_key_press(data: &[u8]) -> Result<Self, Error> {
        let key_press = key_press_fb::root_as_key_press(data).map_err(Error::InvalidFlatbuffer)?;
        let key = key_press.key().to_string();
        Ok(Self::Tick(Some(Action::KeyPress(key))))
    }
}
