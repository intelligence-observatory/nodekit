use crate::{Audio, Video};

/// The result of an attempt to extract a [`Frame`].
pub enum Extraction {
    /// We found the target frame.
    Frame { video: Video, audio: Option<Audio> },
    /// We got to the end of the video without finding the frame.
    EndOfVideo,
}
