use thiserror::Error;
use url::Url;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create output directory: {0}")]
    CreateDir(std::io::Error),
    #[error("Failed to find the filename in: {0}")]
    NoFilename(Url),
    #[error("Reqwest error: {0}")]
    Reqwest(reqwest::Error),
    #[error("Failed to write file to cache directory: {0}")]
    Write(std::io::Error),
}
