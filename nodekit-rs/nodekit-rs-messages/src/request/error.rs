use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Invalid Flatbuffer: {0}")]
    InvalidFlatbuffer(flatbuffers::InvalidFlatbuffer),
    #[error("Invalid Flatbuffer prefix: {0}")]
    Prefix(String),
    #[error("Failed to deserialize graph: {0}")]
    DeserializeGraph(serde_json::Error),
}
