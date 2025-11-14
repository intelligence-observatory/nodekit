use markdown::message::Message;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Markdown parsing error: {0}")]
    Md(Message),
    #[error("Unsupported markdown node: {0}")]
    Node(String),
    #[error("Invalid header depth: {0}")]
    HeaderDepth(u8),
    #[error("{0}")]
    Visual(nodekit_rs_visual::Error)
}
