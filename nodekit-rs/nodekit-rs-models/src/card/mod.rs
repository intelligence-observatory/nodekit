mod card_type;
mod image;
mod status;
mod text;
mod timer;
mod video;

use crate::rect::Rect;
pub use card_type::CardType;
pub use image::Image;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::new_key_type;
pub use status::Status;
use std::path::PathBuf;
pub use text::*;
pub use timer::Timer;
pub use video::Video;

new_key_type! { pub struct CardKey; }

/// A card that can be placed on the board, plus a stateful timer.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct Card {
    /// The position and size of the card.
    pub rect: Rect,
    /// The start and end time of a card.
    pub timer: Timer,
    /// If card A has a higher `z_index` than card B, card A will render on top of card B.
    pub z_index: Option<u32>,
    /// The type of card.
    pub card_type: CardType,
}

#[gen_stub_pymethods]
#[pymethods]
impl Card {
    #[staticmethod]
    pub fn image_card(rect: Rect, timer: Timer, path: PathBuf, z_index: Option<u32>) -> Self {
        Self {
            rect,
            timer,
            z_index,
            card_type: CardType::Image(Image { path }),
        }
    }

    #[staticmethod]
    pub fn video_card(
        rect: Rect,
        timer: Timer,
        path: PathBuf,
        looped: bool,
        z_index: Option<u32>,
    ) -> Self {
        Self {
            rect,
            timer,
            z_index,
            card_type: CardType::Video(Video::new(path, looped)),
        }
    }

    #[staticmethod]
    #[allow(clippy::too_many_arguments)]
    pub fn text_card(
        rect: Rect,
        timer: Timer,
        text: String,
        font_size: f64,
        justification_horizontal: JustificationHorizontal,
        justification_vertical: JustificationVertical,
        text_color: &str,
        background_color: &str,
        z_index: Option<u32>,
    ) -> Self {
        Self {
            rect,
            timer,
            z_index,
            card_type: CardType::Text(Text {
                text,
                font_size,
                justification_horizontal,
                justification_vertical,
                text_color: text_color.to_string(),
                background_color: background_color.to_string(),
            }),
        }
    }
}

impl Card {
    /// The status of the card at time `t_msec`.
    pub const fn status(&self, t_msec: u64) -> Status {
        if t_msec < self.timer.start_msec {
            Status::Pending
        } else if t_msec == self.timer.start_msec {
            Status::StartedNow
        } else if let Some(end_msec) = self.timer.end_msec {
            if t_msec < end_msec {
                Status::Active
            } else if t_msec == end_msec {
                Status::EndedNow
            } else {
                Status::Finished
            }
        } else {
            // No end time.
            Status::Active
        }
    }

    pub const fn is_visible(&self, t_msec: u64) -> bool {
        matches!(self.status(t_msec), Status::StartedNow | Status::Active)
    }
}
