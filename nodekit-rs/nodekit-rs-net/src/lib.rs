mod error;
mod received;

use async_zmq::{Context, Reply, reply};
pub use error::Error;
use flatbuffers::{FlatBufferBuilder, size_prefixed_root};
use nodekit_rs_fb::response::{self, Response, ResponseArgs};
use nodekit_rs_state::{EntityState, TickResult};
pub use received::Received;
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
    pub async fn receive(&mut self) -> Result<Received, Error> {
        let message = self.socket.recv().await.map_err(Error::Zmq)?;
        let data = message[0].deref();
        match size_prefixed_root::<&str>(data).map_err(Error::InvalidFlatbuffer)? {
            "graf" => Self::deserialize_graph(data),
            other => Err(Error::Prefix(other.to_string())),
        }
    }

    /// Serialize a tick result and send it.
    pub async fn send(&mut self, result: TickResult) -> Result<(), Error> {
        let mut fbb = FlatBufferBuilder::new();
        let args = ResponseArgs {
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
        let offset = Response::create(&mut fbb, &args);
        response::finish_response_buffer(&mut fbb, offset);
        self.socket
            .send(fbb.finished_data().to_vec())
            .await
            .map_err(Error::Zmq)?;
        Ok(())
    }

    fn deserialize_graph(data: &[u8]) -> Result<Received, Error> {
        let graph = nodekit_rs_fb::graph::root_as_graph(data).map_err(Error::InvalidFlatbuffer)?;
        let payload = graph.payload().ok_or(Error::GraphPayload)?;
        let graph = from_slice::<nodekit_rs_graph::Graph>(payload.bytes())
            .map_err(Error::DeserializeGraph)?;
        Ok(Received::Graph(graph))
    }
}
