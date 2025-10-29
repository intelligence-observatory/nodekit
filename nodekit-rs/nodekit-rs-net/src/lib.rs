mod command;
mod error;

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
        } else {
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

        let visual = result.visual.as_ref().map(|visual| {
            let buffer = Some(fbb.create_vector(&visual.buffer));
            let args = response::VisualFrameArgs {
                buffer,
                width: visual.width,
                height: visual.height
            };
            response::VisualFrame::create(&mut fbb, &args)
        });

        let audio = result.audio.as_ref().map(|audio| {
            let buffer = Some(fbb.create_vector(&audio.buffer));
            let format = match audio.format.as_ref() {
                Some(format) => match format {
                    nodekit_rs_audio::AudioFormat::U8 => response::AudioFormat::U8,
                    nodekit_rs_audio::AudioFormat::I16 => response::AudioFormat::I16,
                    nodekit_rs_audio::AudioFormat::I32 => response::AudioFormat::I32,
                    nodekit_rs_audio::AudioFormat::I64 => response::AudioFormat::I64,
                    nodekit_rs_audio::AudioFormat::F32 => response::AudioFormat::F32,
                    nodekit_rs_audio::AudioFormat::F64 => response::AudioFormat::F64,
                },
                None => response::AudioFormat::None,
            };
           let args = response::AudioFrameArgs {
               buffer,
               format,
               rate: audio.rate,
               channels: audio.channels,
           };
            response::AudioFrame::create(&mut fbb, &args)
        });

        let args = response::ResponseArgs {
            visual,
            audio,
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
