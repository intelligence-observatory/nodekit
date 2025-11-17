use scuffle_ffmpeg::error::FfmpegError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("ffmpeg error: {0}")]
    Ffmpeg(FfmpegError),
    #[error("Failed to find a video track")]
    NoVideoTrack,
    #[error("Decoder is not a video decoder")]
    NotVideoDecoder,
    #[error("Failed to find x264 codec")]
    X264
}
