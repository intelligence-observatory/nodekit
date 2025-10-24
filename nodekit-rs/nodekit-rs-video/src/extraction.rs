use crate::size::Size;

/// The result of an attempt to extract a [`Frame`].
pub enum Extraction {
    /// We found the target frame.
    Frame {
        video: Vec<u8>,
        audio: Option<Vec<u8>>,
        size: Size,
    },
    /// We got to the end of the video without finding the frame.
    EndOfVideo,
}
