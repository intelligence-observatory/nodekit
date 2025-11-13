mod card;
mod node;

use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs_models {
    #[pymodule_export]
    pub use crate::card::{
        Card, CardType, Image, JustificationHorizontal, JustificationVertical, Position, Rect,
        Size, Text, Timer, Video,
    };
    #[pymodule_export]
    pub use crate::node::Node;

    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}
