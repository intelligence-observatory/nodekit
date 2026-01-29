pub enum SliderOrientation {
    Horizontal,
    Vertical,
}

pub struct Slider {
    pub num_bins: usize,
    pub bin: usize,
    pub show_bin_markers: bool,
    pub orientation: SliderOrientation,
    pub committed: bool,
}
