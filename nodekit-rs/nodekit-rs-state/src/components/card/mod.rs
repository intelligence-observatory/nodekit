mod image;
mod text;
mod video;

use crate::rect::Rect;
use blittle::*;
pub use image::*;
use nodekit_rs_board::*;
use nodekit_rs_graph::NodeCardsValue;
use slotmap::new_key_type;
pub use text::*;
pub use video::*;

new_key_type! { pub struct CardKey; }

pub struct Card(pub Rect);

impl Card {
    pub const fn spatial_coordinate(c: f64) -> isize {
        (BOARD_D_HALF_F64 + BOARD_D_F64 * c) as isize
    }

    pub const fn size_coordinate(c: f64) -> usize {
        (BOARD_D_F64 * c) as usize
    }
}

macro_rules! from_raw {
    ($card:ident) => {{
        let position = PositionI {
            x: Self::spatial_coordinate($card.x),
            y: Self::spatial_coordinate($card.y),
        };
        let mut size = Size {
            w: Self::size_coordinate($card.w),
            h: Self::size_coordinate($card.h),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self(Rect { position, size })
    }};
}

impl From<&NodeCardsValue> for Card {
    fn from(value: &NodeCardsValue) -> Self {
        match value {
            NodeCardsValue::FreeTextEntryCard(card) => from_raw!(card),
            NodeCardsValue::ImageCard(card) => from_raw!(card),
            NodeCardsValue::SliderCard(card) => from_raw!(card),
            NodeCardsValue::TextCard(card) => from_raw!(card),
            NodeCardsValue::VideoCard(card) => from_raw!(card),
        }
    }
}
