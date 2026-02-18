use nodekit_rs_models::sensor::CardKeyError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Invalid button state: {0}. Options are: enabled, disabled, hovering.")]
    ButtonState(String),
    #[error("{0}")]
    CardKey(CardKeyError),
    #[error("Confirm button not found.")]
    ConfirmButton,
    #[error(
        "bin is {} but it must be less than the slider's total number of bins ({})",
        bin,
        num_bins
    )]
    Bin { bin: usize, num_bins: usize },
    #[error("SliderSensor not found.")]
    NoSlider,
    #[error("Bin value must be greater than zero.")]
    BinValue,
}
