use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::{Asset, Region};
use nodekit_rs_image::load_image;
use std::path::PathBuf;

fn criterion_benchmark(c: &mut Criterion) {
    let asset = Asset::Path(PathBuf::from("test_image.png"));
    let region = Region::default();
    c.bench_function("load image", |b| {
        b.iter(|| {
            load_image(&asset, &region).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
