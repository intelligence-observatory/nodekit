use pyo3::prelude::*;

/// An API exposed to the Python client:
///
/// - Serialized a request
/// - Deserialize a `Response`
#[pymodule]
pub mod nodekit_rs_client {
    use pyo3_stub_gen::define_stub_info_gatherer;
    #[pymodule_export]
    pub use nodekit_rs_request::serialize::{click, graph, key_press, noop};
    #[pymodule_export]
    pub use nodekit_rs_response::{AudioFormat, AudioFrame, Response, VisualFrame};

    define_stub_info_gatherer!(stub_info);
}
