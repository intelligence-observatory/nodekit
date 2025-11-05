use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_state::{Card, Video};
use std::path::PathBuf;

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 128;
    let height = 128;
    let card = Card::new(0, 0, width, height);
    let mut board = vec![0; 768 * 768 * 3];
    let mut audio = None;
    let mut video = Video::new(
        PathBuf::from("../nodekit-rs-video/test-video.mp4"),
        width as u32,
        height as u32,
        false,
        false,
    );
    video.load().unwrap();
    c.bench_function("video card", |b| {
        b.iter(|| {
            while let Ok(true) = video.blit(&card, &mut board, &mut audio) {}
            video.reset()
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
