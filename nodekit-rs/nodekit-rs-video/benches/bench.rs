use std::path::PathBuf;
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_card::{Asset, Region};
use nodekit_rs_video::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let region = Region {
        x: 0.,
        y: 0.1,
        w: 0.4,
        h: 0.6,
        z_index: None,
    };
    let mut video = Video::new(&Asset::Path(PathBuf::from("test-video.mp4")), &region).unwrap().unwrap();

    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            video.get_frame(300).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
