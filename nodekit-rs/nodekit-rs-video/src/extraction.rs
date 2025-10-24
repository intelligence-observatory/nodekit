/// The result of an attempt to extract a [`Frame`].
pub enum Extraction {
    Frame {
        video: Vec<u8>,
        audio: Option<Vec<u8>>,
    },
    EndOfVideo,
}
