use std::path::PathBuf;
use thiserror::Error;
use url::Url;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create output directory: {0}")]
    CreateDir(std::io::Error),
    #[error("Failed to find the filename in: {0}")]
    NoUrlFilename(Url),
    #[error("Failed to find the filename in: {0}")]
    NoPathFilename(String),
    #[error("Reqwest error: {0}")]
    Reqwest(reqwest::Error),
    #[error("Failed to write file to cache directory: {0}")]
    Write(std::io::Error),
    #[error("Invalid hash: {0}")]
    BadHash(String),
    #[error("Zip file not found: {0}")]
    NoZip(PathBuf),
    #[error("Failed to open zip file: {0}")]
    OpenZip(std::io::Error),
    #[error("Zip error: {0}")]
    Zip(async_zip::error::ZipError),
    #[error("Zip entry not found: {0}")]
    MissingEntry(String),
    #[error("Source file not found: {0}")]
    NoSourceFile(PathBuf),
    #[error("Failed to read source file: {0}")]
    Read(std::io::Error),
    #[error("Failed to copy file: {0}")]
    Copy(std::io::Error),
}
