use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_response::*;

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
        finished: false,
        version: "0.1.0".to_string(),
    };
    c.bench_function("response serialization", |b| {
        b.iter(|| {
            response.serialize().unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
