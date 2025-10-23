use flatbuffers::FlatBufferBuilder;
use nodekit_rs_action::Action;
use nodekit_rs_fb::{graph, click, key_press};
use pyo3::prelude::*;

#[pyclass]
#[derive(Clone)]
pub enum Payload {
    Graph(String),
    Tick(Option<Action>),
}

#[pyfunction]
pub fn serialize(payload: Payload) -> Vec<u8> {
    match payload {
        Payload::Graph(graph) => serialize_graph(graph),
        Payload::Tick(action) => match action {
            Some(action) => {
                match action {
                    Action::Click { x, y } => serialize_click(x, y),
                    Action::KeyPress(key) => serialize_key_press(key),
                    Action::Submit() => todo!("serialize submit")
                }
            }
            None => Vec::default()
        }
    }
}

fn serialize_graph(graph: String) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let payload = fbb.create_vector(graph.as_bytes());
    let args = graph::GraphArgs {
        payload: Some(payload)
    };
    let offset = graph::Graph::create(&mut fbb, &args);
    graph::finish_graph_buffer(&mut fbb, offset);
    fbb.finished_data().to_vec()
}

fn serialize_click(x: f32, y: f32) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let args = click::ClickArgs {
        x,
        y
    };
    let offset = click::Click::create(&mut fbb, &args);
    click::finish_click_buffer(&mut fbb, offset);
    fbb.finished_data().to_vec()
}

fn serialize_key_press(key: String) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let key = fbb.create_string(&key);
    let args = key_press::KeyPressArgs {
        key: Some(key)
    };
    let offset = key_press::KeyPress::create(&mut fbb, &args);
    key_press::finish_key_press_buffer(&mut fbb, offset);
    fbb.finished_data().to_vec()
}