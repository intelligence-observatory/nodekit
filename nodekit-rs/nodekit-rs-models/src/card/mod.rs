mod image;
mod status;
mod video;
mod text;
mod card_type;

pub use image::Image;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
pub use status::Status;
pub use text::Text;
pub use video::Video;
use crate::card::card_type::CardType;

/// A card that can be placed on the board, plus a stateful timer.
#[gen_stub_pyclass]
#[pyclass]
pub struct Card {
    /// The x coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    pub x: f64,
    /// The y coordinate of the position. -0.5 to 0.5, with 0.0 being the center of the board.
    pub y: f64,
    /// The width of the card. 0.0 to 1.0, with 1.0 being the width of the board.
    pub w: f64,
    /// The height of the card. 0.0 to 1.0, with 1.0 being the height of the board.
    pub h: f64,
    /// If card A has a higher `z_index` than card B, card A will render on top of card B.
    pub z_index: Option<u32>,
    /// The card is visible at this time onward, in milliseconds.
    pub start_msec: u64,
    /// The card is hidden at this time onward, in milliseconds.
    pub end_msec: Option<u64>,
    /// The type of card.
    pub card_type: CardType,
}

#[gen_stub_pymethods]
#[pymethods]
impl Card {
    /// The status of the card at time `t_msec`.
    pub fn status(&mut self, t_msec: u64) -> Status {
        if t_msec < self.start_msec {
            Status::Pending
        }
        else if t_msec == self.start_msec {
            Status::StartedNow
        }
        else if let Some(end_msec) = self.end_msec {
            if t_msec < end_msec {
                Status::Active
            }
            else if t_msec == end_msec {
                Status::EndedNow
            }
            else {
                Status::Finished
            }
        }
        else {
            // No end time.
            Status::Active
        }
    }
}
