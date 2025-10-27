use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Invalid audio rate: {0}")]
    Rate(u32),
    #[error("Source audio doesn't have channels")]
    NoChannels,
    #[error("No audio format found.")]
    NoFormat,
}
