use nodekit_rs_audio::AudioFrame;
use nodekit_rs_visual::VisualFrame;

/// The result of an attempt to extract a [`Frame`].
pub enum Extraction {
    /// We found the target frame.
    Frame {
        video: VisualFrame,
        audio: Option<AudioFrame>,
    },
    /// We got to the end of the video without finding the frame.
    EndOfVideo,
}
