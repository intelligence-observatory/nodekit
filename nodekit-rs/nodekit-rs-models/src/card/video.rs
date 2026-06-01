use crate::card::Asset;

pub struct VideoCard {
    /// The video asset.
    pub asset: Asset,
    /// Control whether the video loops.
    pub looped: bool,
}
