use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_video::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let video = include_bytes!("../test-video.mp4");
    let width = 400;
    let height = 300;
    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            get_frame(video, 300, width, height).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
