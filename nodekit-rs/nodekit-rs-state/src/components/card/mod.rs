mod image;
mod text;
mod video;

use super::entity_state::EntityState;
use crate::error::Error;
use crate::rect::Rect;
pub use image::*;
use nodekit_rs_graph::{AssetLocator, NodeCardsValue};
use slotmap::new_key_type;
use std::path::PathBuf;
use blittle::{PositionU, Size};
pub use text::*;
pub use video::*;

#[macro_export]
macro_rules! get_w_h {
    ($card:ident) => {{
        (
            $crate::board::size_coordinate($card.w.0) as u32,
            $crate::board::size_coordinate($card.h.0) as u32,
        )
    }};
}

macro_rules! from_schema_card {
    ($card:ident) => {{
        let rect = Rect::new($card.x.0, $card.y.0, $card.w.0, $card.h.0);
        Self {
            rect,
            state: EntityState::default(),
            z_index: $card.z_index.unwrap_or(0),
        }
    }};
}

fn get_path(locator: &AssetLocator) -> Result<PathBuf, Error> {
    match locator {
        AssetLocator::FileSystemPath(path) => Ok(PathBuf::from(&path.path)),
        AssetLocator::RelativePath(path) => Ok(PathBuf::from(&path.relative_path)),
        other => Err(Error::AssetLocator(other.clone())),
    }
}

new_key_type! { pub struct CardKey; }

pub struct Card {
    pub rect: Rect,
    pub state: EntityState,
    pub(crate) z_index: i64,
}

impl Card {
    pub fn new(x: usize, y: usize, w: usize, h: usize) -> Self {
        Self {
            rect: Rect {
                position: PositionU {x, y},
                size: Size {w, h}
            },
            state: EntityState::Active,
            z_index: 0
        }
    }
}

impl From<&NodeCardsValue> for Card {
    fn from(value: &NodeCardsValue) -> Self {
        match value {
            NodeCardsValue::FreeTextEntryCard(card) => from_schema_card!(card),
            NodeCardsValue::ImageCard(card) => from_schema_card!(card),
            NodeCardsValue::SliderCard(card) => from_schema_card!(card),
            NodeCardsValue::TextCard(card) => from_schema_card!(card),
            NodeCardsValue::VideoCard(card) => from_schema_card!(card),
        }
    }
}
