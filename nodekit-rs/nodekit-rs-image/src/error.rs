use std::path::PathBuf;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create {1}: {0}")]
    OpenFile(std::io::Error, PathBuf),
    #[error("Failed to decode {1}: {0}")]
    Decode(png::DecodingError, PathBuf),
    #[error("Failed to get the buffer size of {0}")]
    BufferSize(PathBuf),
    #[error("This image has indexed colors, which is not supported: {0}")]
    Indexed(PathBuf),
    #[error("{0}")]
    Visual(nodekit_rs_visual::Error),
}
