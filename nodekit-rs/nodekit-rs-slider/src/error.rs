use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("track.raw is not a 17x17x4 byte array: 0")]
    RawTrack(nine_slice::fast_image_resize::ImageBufferError),
    #[error("nine-slice error: {0}")]
    NineSlice(nine_slice::Error),
}
