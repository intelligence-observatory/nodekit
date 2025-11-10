use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Request error: {0}")]
    Request(nodekit_rs_request::Error),
    #[error("Response error: {0}")]
    Response(nodekit_rs_response::Error),
    #[error("Network error: {0}")]
    Zmq(zmq::Error),
}
