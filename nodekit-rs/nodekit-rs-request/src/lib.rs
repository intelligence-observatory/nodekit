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
use glam::DVec2;
use nodekit_rs_fb::{
    graph as graph_fb, key_press as key_press_fb, mouse as mouse_fb, noop as noop_fb,
    reset as reset_fb,
};
use nodekit_rs_graph::Graph;
use serde_json::from_slice;
use std::str::from_utf8;

/// A deserialized sent from Python to the simulator.
pub enum Request {
    /// Reset the simulator (set `state` to None).
    Reset,
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
            if graph_fb::graph_buffer_has_identifier(buffer) {
                Self::deserialize_graph(buffer)
            } else if mouse_fb::mouse_buffer_has_identifier(buffer) {
                Self::deserialize_mouse(buffer)
            } else if key_press_fb::key_press_buffer_has_identifier(buffer) {
                Self::deserialize_key_press(buffer)
            } else if noop_fb::noop_buffer_has_identifier(buffer) {
                Ok(Self::Tick(None))
            } else if reset_fb::reset_buffer_has_identifier(buffer) {
                Ok(Self::Reset)
            } else {
                let id = from_utf8(&buffer[4..8]).map_err(|_| {
                    Error::PrefixNotUtf8([buffer[4], buffer[5], buffer[6], buffer[7]])
                })?;
                Err(Error::Prefix(id.to_string()))
            }
        }
    }

    fn deserialize_graph(data: &[u8]) -> Result<Self, Error> {
        let graph = graph_fb::root_as_graph(data).map_err(Error::InvalidFlatbuffer)?;
        let graph =
            from_slice::<Graph>(graph.node_graph().bytes()).map_err(Error::DeserializeGraph)?;
        Ok(Self::Graph(graph))
    }

    fn deserialize_mouse(data: &[u8]) -> Result<Self, Error> {
        let mouse = mouse_fb::root_as_mouse(data).map_err(Error::InvalidFlatbuffer)?;
        let delta = mouse.delta().map(|delta| DVec2 {
            x: delta.x(),
            y: delta.y(),
        });
        Ok(Self::Tick(Some(Action::Mouse {
            delta,
            clicked: mouse.clicked(),
        })))
    }

    fn deserialize_key_press(data: &[u8]) -> Result<Self, Error> {
        let key_press = key_press_fb::root_as_key_press(data).map_err(Error::InvalidFlatbuffer)?;
        let key = key_press.key().to_string();
        Ok(Self::Tick(Some(Action::KeyPress(key))))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use flatbuffers::FlatBufferBuilder;

    #[test]
    fn deserialize_noop() {
        let mut fbb = FlatBufferBuilder::new();
        let n = noop_fb::Noop::create(&mut fbb, &noop_fb::NoopArgs::default());
        noop_fb::finish_noop_buffer(&mut fbb, n);
        let noop = fbb.finished_data();
        println!("{:?}", noop);
        let prefix = &noop[4..8];
        assert_eq!("noop".as_bytes(), prefix);
        assert!(noop_fb::noop_buffer_has_identifier(noop));
    }
}
