use flatbuffers::FlatBufferBuilder;
use nodekit_rs_action::Action;
use nodekit_rs_fb::{click as click_fb, graph as graph_fb, key_press as key_press_fb};
use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs_client {
    use super::*;
    #[pymodule_export]
    pub use nodekit_rs_response::Response;

    /// A payload that can be sent to the `nodekit-rs` app.
    #[pyclass]
    #[derive(Clone)]
    pub enum Payload {
        Graph(String),
        Tick(Option<Action>),
    }

    /// Convert a keyboard key into a `Payload`.
    #[pyfunction]
    pub fn key_press(key: String) -> Payload {
        Payload::Tick(Some(Action::KeyPress(key)))
    }

    fn serialize_graph(graph: String) -> Vec<u8> {
        let mut fbb = FlatBufferBuilder::new();
        let payload = fbb.create_vector(graph.as_bytes());
        let args = graph_fb::GraphArgs {
            payload: Some(payload),
        };
        let offset = graph_fb::Graph::create(&mut fbb, &args);
        graph_fb::finish_graph_buffer(&mut fbb, offset);
        fbb.finished_data().to_vec()
    }

    fn serialize_click(x: f32, y: f32) -> Vec<u8> {
        let mut fbb = FlatBufferBuilder::new();
        let args = click_fb::ClickArgs { x, y };
        let offset = click_fb::Click::create(&mut fbb, &args);
        click_fb::finish_click_buffer(&mut fbb, offset);
        fbb.finished_data().to_vec()
    }

    fn serialize_key_press(key: String) -> Vec<u8> {
        let mut fbb = FlatBufferBuilder::new();
        let key = fbb.create_string(&key);
        let args = key_press_fb::KeyPressArgs { key: Some(key) };
        let offset = key_press_fb::KeyPress::create(&mut fbb, &args);
        key_press_fb::finish_key_press_buffer(&mut fbb, offset);
        fbb.finished_data().to_vec()
    }
}
