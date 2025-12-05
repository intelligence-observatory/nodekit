use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs {
    #[pymodule_export]
    pub use nodekit_rs_models::{
        Card, JustificationHorizontal, JustificationVertical, Rect, State, Timer,
    };
    #[pymodule_export]
    pub use nodekit_rs_render::Renderer;

    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}
