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
    #[error("Failed to parse background color: {0}")]
    BackgroundColor(nodekit_rs_visual::Error),
    #[error("Failed to parse text color: {0}")]
    TextColor(nodekit_rs_visual::Error),
}
