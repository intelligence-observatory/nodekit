use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to encode: {0}")]
    Encode(bincode::error::EncodeError),
    #[error("Failed to decode: {0}")]
    Decode(bincode::error::DecodeError),
    #[error("Failed to deserialize graph: {0}")]
    DeserializeGraph(serde_json::Error),
}
