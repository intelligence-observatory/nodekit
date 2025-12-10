use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs {
    use pyo3::prelude::*;

    #[pymodule_export]
    pub use nodekit_rs_models::{
        Card, JustificationHorizontal, JustificationVertical, Rect, State, Timer,
    };
    #[pymodule_export]
    pub use nodekit_rs_render::Renderer;

    #[pymodule]
    mod testing {
        #[pymodule_export]
        pub use nodekit_rs_card::test_region;
    }

    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}
