use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_image::load;
use nodekit_rs_models::{Image, Position, Rect, Size};
use std::path::PathBuf;

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("load image", |b| {
        b.iter(|| {
            load(
                &Image {
                    path: PathBuf::from("test_image.png"),
                },
                Rect {
                    size: Size { w: 1., h: 1. },
                    position: Position { x: -0.5, y: -0.5 },
                },
            )
            .unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
