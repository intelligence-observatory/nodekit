mod error;
mod command;

use async_zmq::{Context, Reply, reply};
pub use command::Command;
pub use error::Error;
use flatbuffers::{FlatBufferBuilder, size_prefixed_root};
use nodekit_rs_action::*;
use nodekit_rs_fb::{click, graph, key_press, response};
use nodekit_rs_state::{EntityState, TickResult};
use serde_json::from_slice;
use std::ops::Deref;
use std::vec::IntoIter;

/// Receive actions from a client.
/// Respond with stateful information.
pub struct Connection {
    _context: Context,
    socket: Reply<IntoIter<Vec<u8>>, Vec<u8>>,
}

impl Connection {
    pub fn new(endpoint: &str) -> Result<Self, async_zmq::Error> {
        let context = Context::new();
        let socket = reply(endpoint)?.bind()?;
        Ok(Self {
            _context: context,
            socket,
        })
    }

    /// Try to receive a message.
    pub async fn receive(&mut self) -> Result<Command, Error> {
        let message = self.socket.recv().await.map_err(Error::Zmq)?;
        let data = message[0].deref();
        if data.is_empty() {
            Ok(Command::Tick(None))
        }
        else {
            match size_prefixed_root::<&str>(data).map_err(Error::InvalidFlatbuffer)? {
                "graf" => Self::deserialize_graph(data),
                "clik" => Self::deserialize_click(data),
                "keyp" => Self::deserialize_key_press(data),
                other => Err(Error::Prefix(other.to_string())),
            }
        }
    }

    /// Serialize a tick result and send it.
    pub async fn send(&mut self, result: TickResult) -> Result<(), Error> {
        let mut fbb = FlatBufferBuilder::new();
        let args = response::ResponseArgs {
            board: result.board.map(|board| fbb.create_vector(&board)),
            audio: result.audio.map(|audio| fbb.create_vector(&audio)),
            state: match result.state {
                EntityState::Pending => response::State::Pending,
                EntityState::StartedNow => response::State::StartedNow,
                EntityState::Active => response::State::Active,
                EntityState::EndedNow => response::State::EndedNow,
                EntityState::Finished => response::State::Finished,
            },
        };
        let offset = response::Response::create(&mut fbb, &args);
        response::finish_response_buffer(&mut fbb, offset);
        self.socket
            .send(fbb.finished_data().to_vec())
            .await
            .map_err(Error::Zmq)?;
        Ok(())
    }

    fn deserialize_graph(data: &[u8]) -> Result<Command, Error> {
        let graph = graph::root_as_graph(data).map_err(Error::InvalidFlatbuffer)?;
        let payload = graph.payload();
        let graph = from_slice::<nodekit_rs_graph::Graph>(payload.bytes())
            .map_err(Error::DeserializeGraph)?;
        Ok(Command::Graph(graph))
    }

    fn deserialize_click(data: &[u8]) -> Result<Command, Error> {
        let click = click::root_as_click(data).map_err(Error::InvalidFlatbuffer)?;
        Ok(Command::Tick(Some(Action::Click {
            x: click.x(),
            y: click.y(),
        })))
    }

    fn deserialize_key_press(data: &[u8]) -> Result<Command, Error> {
        let key_press = key_press::root_as_key_press(data).map_err(Error::InvalidFlatbuffer)?;
        let key = key_press.key().to_string();
        Ok(Command::Tick(Some(Action::KeyPress(key))))
    }
}
