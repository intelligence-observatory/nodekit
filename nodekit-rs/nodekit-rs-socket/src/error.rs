use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Request error: {0}")]
    Request(nodekit_rs_request::Error),
    #[error("Network error: {0}")]
    Zmq(zmq::Error),
}
