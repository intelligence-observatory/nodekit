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
pub use text::*;
pub use video::*;

#[macro_export]
macro_rules! get_w_h {
    ($card:ident) => {{
        (
            Rect::size_coordinate($card.w) as u32,
            Rect::size_coordinate($card.h) as u32,
        )
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
}

macro_rules! from_schema_card {
    ($card:ident) => {{
        let rect = Rect::new($card.x, $card.y, $card.w, $card.h);
        Self {
            rect,
            state: EntityState::default(),
        }
    }};
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
