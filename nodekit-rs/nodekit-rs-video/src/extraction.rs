use crate::Frame;

pub enum Extraction {
    Frame(Frame),
    NoFrame,
    EndOfVideo
}