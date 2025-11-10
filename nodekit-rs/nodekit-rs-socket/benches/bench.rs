use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_response::*;
use nodekit_rs_socket::*;
use std::sync::{Arc, Mutex};
use std::thread::spawn;
use bincode::config::Configuration;
use bincode::serde::encode_to_vec;
use zmq::Context;
use nodekit_rs_request::Request;

const ENDPOINT: &str = "ipc:///tmp/nodekit-rs-socket";

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 768;
    let height = 768;
    let stride = 3;
    let response = Response {
        visual: Some(VisualFrame {
            buffer: vec![0; width * height * stride],
            width: width as u32,
            height: height as u32,
        }),
        audio: Some(AudioFrame {
            buffer: vec![0; 8192],
            format: Some(AudioFormat::F32),
            channels: 2,
            rate: 44100,
        }),
        sensor: Some("sensor".to_string()),
        version: "0.1.0".to_string(),
        finished: false,
    };
    let mut connection = Connection::new(ENDPOINT).unwrap();
    let kill = Arc::new(Mutex::new(false));
    let k = kill.clone();
    let handle = spawn(|| client_thread(k));
    c.bench_function("socket overhead", |b| {
        b.iter(|| {
            connection.receive().unwrap();
            connection
                .send(&response)
                .unwrap();
        })
    });
    *kill.lock().unwrap() = true;
    handle.join().unwrap();
}

fn client_thread(kill: Arc<Mutex<bool>>) {
    let context = Context::new();
    let socket = context.socket(zmq::REQ).unwrap();
    socket.connect(ENDPOINT).unwrap();
    socket.set_rcvtimeo(5000).unwrap();
    while !is_killed(&kill) {
        let noop = noop();
        socket.send(noop, 0).unwrap();
        let _ = socket.recv_bytes(0);
    }
}

fn noop() -> Vec<u8> {
    encode_to_vec::<Request, Configuration>(Request::Tick(None), Configuration::default()).unwrap()
}

fn is_killed(kill_receiver: &Arc<Mutex<bool>>) -> bool {
    *kill_receiver.lock().unwrap()
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
