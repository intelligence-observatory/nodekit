use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_video::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            let mut extractor = FrameExtractor::new("test-video.mp4", false).unwrap();
            while !matches!(extractor.get_next_frame().unwrap(), Extraction::EndOfVideo) {}
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
