use scuffle_ffmpeg::error::FfmpegError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Asset error: {0}")]
    Asset(nodekit_rs_asset::Error),
    #[error("ffmpeg error: {0}")]
    Ffmpeg(FfmpegError),
    #[error("Failed to find a video track")]
    NoVideoTrack,
    #[error("Decoder is not a video decoder")]
    NotVideoDecoder,
    #[error("Failed to find a frame at t={0}")]
    NoFrame(u64),
    #[error("Got an empty frame")]
    NoData,
    #[error("Frame row {0} doesn't exist")]
    NotEnoughRows(usize),
    #[error("Timestamp {t_msec}ms exceeds video duration: {duration}ms")]
    EndOfVideo { t_msec: u64, duration: f64 },
}
