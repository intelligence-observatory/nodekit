use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    Image(nodekit_rs_image::Error),
    #[error("{0}")]
    ParseColor(nodekit_rs_visual::Error),
}
