use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Invalid Flatbuffer: {0}")]
    InvalidFlatbuffer(flatbuffers::InvalidFlatbuffer),
    #[error("Flatbuffer prefix is not UTF-8: {:?}", 0)]
    PrefixNotUtf8([u8; 4]),
    #[error("Invalid Flatbuffer prefix: {0}")]
    Prefix(String),
    #[error("Failed to deserialize graph: {0}")]
    DeserializeGraph(serde_json::Error),
}
