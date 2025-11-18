use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs {
    pub use nodekit_rs_models::{
        Card, CardType, Image, JustificationHorizontal, JustificationVertical, Text, Timer,
        Video, Position, Rect, Size
    };
    pub use nodekit_rs_render::Renderer;

    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}