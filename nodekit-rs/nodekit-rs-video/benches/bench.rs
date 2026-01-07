use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::board::BOARD_D_I64;
use nodekit_rs_models::{Asset, Region};
use nodekit_rs_video::*;
use std::path::PathBuf;

pub fn criterion_benchmark(c: &mut Criterion) {
    let region = Region {
        x: -BOARD_D_I64,
        y: 564,
        w: 410,
        h: 614,
        z_index: None,
    };
    let mut video = Video::new(&Asset::Path(PathBuf::from("test-video.mp4")), &region)
        .unwrap()
        .unwrap();

    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            video.get_frame(300).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
