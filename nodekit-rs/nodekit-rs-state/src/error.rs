use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Failed to create video frame extractor: {0}")]
    FrameExtractor(ffmpeg_next::Error)
}