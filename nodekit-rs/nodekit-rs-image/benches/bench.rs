use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_card::{Asset, Region};
use nodekit_rs_image::load;
use std::path::PathBuf;

fn criterion_benchmark(c: &mut Criterion) {
    let asset = Asset::Path(PathBuf::from("test_image.png"));
    let region = Region::default();
    c.bench_function("load image", |b| {
        b.iter(|| {
            load(&asset, &region).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
