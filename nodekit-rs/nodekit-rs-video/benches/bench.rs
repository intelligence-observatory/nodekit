use blittle::PositionU;
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_video::*;
use nodekit_rs_visual::Rect;

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 400;
    let height = 300;

    let rect = Rect {
        position: PositionU { x: 0, y: 0 },
        size: blittle::Size {
            w: width,
            h: height,
        },
    };
    let video = Video {
        buffer: include_bytes!("../test-video.mp4").to_vec(),
        width,
        height,
        rect,
    };

    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            video.get_frame(300).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
