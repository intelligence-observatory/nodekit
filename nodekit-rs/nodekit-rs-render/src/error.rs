use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    Image(nodekit_rs_image::Error),
    #[error("{0}")]
    Text(nodekit_rs_text::Error),
    #[cfg(target_os = "linux")]
    #[error("{0}")]
    Video(nodekit_rs_video::Error),
    #[error("{0}")]
    ParseColor(nodekit_rs_visual::Error),
}
