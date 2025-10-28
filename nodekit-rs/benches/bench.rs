use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_video::extract_frame;

pub fn video_benchmark(c: &mut Criterion) {
    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            let mut audio_index = 0;
            let mut video_index = 0;
            extract_frame(
                "nodekit-rs-video/test-video.mp4",
                200,
                false,
                &mut audio_index,
                &mut video_index,
            )
            .unwrap()
        })
    });
}

criterion_group!(benches, video_benchmark);
criterion_main!(benches);
