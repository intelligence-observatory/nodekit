use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Network error: {0}")]
    Zmq(async_zmq::RequestReplyError),
    #[error("Invalid Flatbuffer: {0}")]
    InvalidFlatbuffer(flatbuffers::InvalidFlatbuffer),
    #[error("Invalid Flatbuffer prefix: {0}")]
    Prefix(String),
    #[error("Failed to deserialize graph: {0}")]
    DeserializeGraph(serde_json::Error),
    #[error("Missing graph payload")]
    GraphPayload,
    #[error("Missing key press key.")]
    NoKey,
}
