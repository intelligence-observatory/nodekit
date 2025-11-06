mod error;

use zmq::{Context, Socket};
pub use error::Error;
use nodekit_rs_request::Request;
use nodekit_rs_response::Response;

/// Receive actions from a client.
/// Respond with stateful information.
pub struct Connection {
    _context: Context,
    socket: Socket,
}

impl Connection {
    pub fn new(endpoint: &str) -> Result<Self, zmq::Error> {
        let context = Context::new();
        let socket = context.socket(zmq::REP)?;
        socket.bind(endpoint)?;
        Ok(Self {
            _context: context,
            socket,
        })
    }

    /// Try to receive a message.
    pub fn receive(&mut self) -> Result<Request, Error> {
        let received = self.socket.recv_bytes(0).map_err(Error::Zmq)?;
        Request::deserialize(&received).map_err(Error::Request)
    }

    /// Serialize a tick result and send it.
    pub fn send(
        &mut self,
        response: &Response,
        version: Option<String>,
    ) -> Result<(), Error> {
        self.socket
            .send(response.serialize(version), 0)
            .map_err(Error::Zmq)?;
        Ok(())
    }
}
