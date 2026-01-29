pub enum SliderOrientation {
    Horizontal,
    Vertical,
}

pub enum ThumbState {
    Committed,
    Uncommitted
}

pub struct Slider {
    pub num_bins: usize,
    pub bin: usize,
    pub show_bin_markers: bool,
    pub orientation: SliderOrientation,
    pub thumb_state: ThumbState
}
