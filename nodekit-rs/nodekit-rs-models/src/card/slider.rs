use crate::card::CardKey;

pub enum SliderOrientation {
    Horizontal,
    Vertical,
}

pub struct Slider {
    pub num_bins: usize,
    pub bin: usize,
    pub show_bin_markers: bool,
    pub orientation: SliderOrientation,
    /// Determines the visual appearance of the thumb.
    /// Not present in the raw Pydantic model.
    pub committed: bool,
    /// The key to the confirm button.
    pub confirm_button: Option<CardKey>
}
