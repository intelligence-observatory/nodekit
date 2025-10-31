//! The Python API of nodekit-rs:
//!
//! - Serialize a request
//! - Deserialize a `Response`

use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs_client {
    #[pymodule_export]
    pub use nodekit_rs_request::serialize::{mouse, graph, key_press, noop};
    #[pymodule_export]
    pub use nodekit_rs_response::{AudioFormat, AudioFrame, Response, VisualFrame};
    use pyo3_stub_gen::define_stub_info_gatherer;

    define_stub_info_gatherer!(stub_info);
}
