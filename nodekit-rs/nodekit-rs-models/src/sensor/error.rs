use thiserror::Error;

#[derive(Debug, Error)]
pub enum SensorError {
    #[error("Invalid sensor child key: {0}")]
    ChildKey(String),
}
