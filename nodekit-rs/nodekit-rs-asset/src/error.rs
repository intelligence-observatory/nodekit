use std::path::PathBuf;
use thiserror::Error;
use url::Url;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to read file system path {0}: {1}")]
    ReadPath(PathBuf, std::io::Error),
    #[error("Failed to download {0}: {1}")]
    HttpGet(Url, reqwest::Error),
    #[error("Failed to download due to an HTTP error {0}: {1}")]
    ResponseError(Url, reqwest::Error),
    #[error("Failed to read bytes of {0}: {1}")]
    HttpBytes(Url, reqwest::Error),
    #[error("Failed to open zip file {0}: {1}")]
    OpenZipFile(PathBuf, std::io::Error),
    #[error("Failed to file as a zip archive {0}: {1}")]
    ZipArchive(PathBuf, zip::result::ZipError),
    #[error("Failed to find zip entry {0} in {1}: {2}")]
    FindZipEntry(PathBuf, PathBuf, zip::result::ZipError),
    #[error("Failed to read zip entry {0} in {1}: {2}")]
    ZipEntryRead(PathBuf, PathBuf, std::io::Error),
}
