use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to open image file: {0}")]
    OpenFile(std::io::Error),
    #[error("Error when decoding png file: {0}")]
    Png(png::DecodingError),
}
