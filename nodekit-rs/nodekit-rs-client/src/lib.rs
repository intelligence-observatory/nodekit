use flatbuffers::FlatBufferBuilder;
use nodekit_rs_action::Action;
use nodekit_rs_fb::{click as click_fb, graph as graph_fb, key_press as key_press_fb, response};
use pyo3::prelude::*;

#[pymodule]
pub mod nodekit_rs_client {
    use pyo3::exceptions::PyTypeError;
    use super::*;

    #[pymodule_export]
    pub const STATUS_PENDING: u8 = 1;
    #[pymodule_export]
    pub const STATUS_STARTED_NOW: u8 = 2;
    #[pymodule_export]
    pub const STATUS_ACTIVE: u8 = 3;
    #[pymodule_export]
    pub const STATUS_ENDED_NOW: u8 = 4;
    #[pymodule_export]
    pub const STATUS_FINISHED: u8 = 5;

    /// A payload that can be sent to the `nodekit-rs` app.
    #[pyclass]
    #[derive(Clone)]
    pub enum Payload {
        Graph(String),
        Tick(Option<Action>),
    }

    #[pyclass]
    #[derive(Clone)]
    pub struct Response {
        pub visual: Option<Vec<u8>>,
        pub audio: Option<Vec<u8>>,
        pub state: u8
    }

    /// A no-op tick.
    #[pyfunction]
    pub fn noop() -> Payload {
        Payload::Tick(None)
    }

    /// Convert a serialized `Graph` into a `Payload`.
    #[pyfunction]
    #[pyo3(signature = (graph: "str"))]
    pub fn graph(graph: String) -> Payload {
        Payload::Graph(graph)
    }

    /// Convert (x, y) coordinates into a `Payload`.
    #[pyfunction]
    pub fn click(x: f32, y: f32) -> Payload {
        Payload::Tick(Some(Action::Click { x, y }))
    }

    /// Convert a keyboard key into a `Payload`.
    #[pyfunction]
    pub fn key_press(key: String) -> Payload {
        Payload::Tick(Some(Action::KeyPress(key)))
    }

    #[pyfunction]
    pub fn serialize_payload(payload: Payload) -> Vec<u8> {
        match payload {
            Payload::Graph(graph) => serialize_graph(graph),
            Payload::Tick(action) => match action {
                Some(action) => match action {
                    Action::Click { x, y } => serialize_click(x, y),
                    Action::KeyPress(key) => serialize_key_press(key),
                    Action::Submit() => todo!("serialize submit"),
                },
                None => Vec::default(),
            },
        }
    }

    #[pyfunction]
    pub fn deserialize_response(response: Vec<u8>) -> PyResult<Response> {
        match response::root_as_response(&response) {
            Ok(response) => {
                Ok(Response {
                    visual: response.board().map(|b| b.bytes().to_vec()),
                    audio: response.audio().map(|a| a.bytes().to_vec()),
                    state: response.state().0
                })
            }
            Err(error) => {
                Err(PyTypeError::new_err(error.to_string()))
            }
        }
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