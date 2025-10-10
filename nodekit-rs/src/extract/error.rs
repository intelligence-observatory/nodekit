use std::path::PathBuf;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("ffmpeg: {0}")]
    Ffmpeg(ffmpeg_next::Error),
    #[error("IO: {0}")]
    Io(std::io::Error),
    #[error("Failed to get filename from: {0}")]
    Filename(PathBuf),
}
