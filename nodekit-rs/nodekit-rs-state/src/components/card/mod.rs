mod image;
mod text;
mod video;

use super::entity_state::EntityState;
use crate::rect::Rect;
pub use image::*;
use nodekit_rs_board::*;
use nodekit_rs_graph::NodeCardsValue;
use slotmap::new_key_type;
pub use text::*;
pub use video::*;

new_key_type! { pub struct CardKey; }

pub struct Card {
    pub rect: Rect,
    pub state: EntityState,
}

impl Card {
    pub const fn spatial_coordinate(c: f64) -> isize {
        (BOARD_D_HALF_F64 + BOARD_D_F64 * c) as isize
    }

    pub const fn size_coordinate(c: f64) -> usize {
        (BOARD_D_F64 * c) as usize
    }
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
