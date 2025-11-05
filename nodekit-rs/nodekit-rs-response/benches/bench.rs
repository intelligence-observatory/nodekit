use criterion::{criterion_group, criterion_main, Criterion};
use nodekit_rs_response::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 768;
    let height = 768;
    let stride = 3;
    let response = Response {
        visual: Some(VisualFrame {
            buffer: vec![0; width * height * stride],
            width: width as u32,
            height: height as u32
        }),
        audio: Some(AudioFrame {
            buffer: vec![0; 8192],
            format: Some(AudioFormat::F32),
            channels: 2,
            rate: 44100
        }),
        sensor: Some("sensor".to_string()),
        finished: false
    };
    c.bench_function("response serialization", |b| {
        b.iter(|| {
            response.serialize(Some("0.0.0"));
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
