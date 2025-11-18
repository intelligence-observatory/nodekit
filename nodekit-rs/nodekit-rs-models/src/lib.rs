mod card;
mod state;
mod rect;

use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs_models {
    pub use crate::{
        card::{
            Card, CardType, Image, JustificationHorizontal, JustificationVertical, Text, Timer,
            Video,
        },
        state::State,
        rect::{Position, Rect, Size},
    };

    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}

pub use card::{CardKey, Status};
pub use nodekit_rs_models::*;
