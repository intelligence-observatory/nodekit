mod asset;
mod card_type;
mod region;
mod region_mask;

pub use region_mask::*;

pub struct Card {
    pub x: f32,
    pub y: f32,
    pub z_index: Option<i32>,
    pub w: f32,
    pub h: f32,
    pub start_msec: u32,
    pub end_msec: u32,
}