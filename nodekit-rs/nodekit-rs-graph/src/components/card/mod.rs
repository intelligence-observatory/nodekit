mod asset_loader;
mod text;

pub use asset_loader::AssetLoader;
use slotmap::new_key_type;
pub use text::*;

new_key_type! { pub struct CardKey; }

pub struct Card {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
}

impl<'c> From<&nodekit_rs_fb::Card<'c>> for Card {
    fn from(value: &nodekit_rs_fb::Card<'c>) -> Self {
        Self {
            x: value.x(),
            y: value.y(),
            w: value.w(),
            h: value.h(),
        }
    }
}
