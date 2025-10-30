mod error;

use async_zmq::{Context, Reply, reply};
pub use error::Error;
use nodekit_rs_request::Request;
use nodekit_rs_response::Response;
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
    pub async fn receive(&mut self) -> Result<Request, Error> {
        let message = self.socket.recv().await.map_err(Error::Zmq)?;
        Request::deserialize(message[0].deref()).map_err(Error::Request)
    }

    /// Serialize a tick result and send it.
    pub async fn send(&mut self, response: Response, version: Option<&str>) -> Result<(), Error> {
        self.socket
            .send(response.serialize(version))
            .await
            .map_err(Error::Zmq)?;
        Ok(())
    }
}
