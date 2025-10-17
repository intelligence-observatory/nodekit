use blittle::*;
use nodekit_rs_board::*;
use nodekit_rs_fb::Graph;

pub struct Card {
    pub position: PositionU,
    pub size: Size,
}

impl Card {
    pub fn deserialize(graph: &Graph) -> Option<Vec<Self>> {
        Some(graph.cards()?.into_iter().map(|card| {
            let position = PositionI {
                x: Self::as_coordinate(card.x()) as isize,
                y: Self::as_coordinate(card.y()) as isize
            };
            let mut size = Size {
                w: Self::as_coordinate(card.w()) as usize,
                h: Self::as_coordinate(card.h()) as usize
            };

            let position = clip(&position, &Size {
                w: BOARD_D,
                h: BOARD_D
            }, &mut size);
            Self {
                position,
                size
            }
        }).collect())
    }

    const fn as_coordinate(value: f32) -> f32 {
        BOARD_D_F32_HALF + BOARD_D_F32 * value
    }
}