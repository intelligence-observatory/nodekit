use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::{Position, Rect, Size};
use nodekit_rs_video::*;
use nodekit_rs_visual::{BlitRect, ResizedRect};

pub fn criterion_benchmark(c: &mut Criterion) {
    let rect = ResizedRect::new(
        &Rect {
            position: Position { x: 0., y: 0. },
            size: Size { w: 0.52, h: 0.39 },
        },
        400,
        300,
    );
    let blit_rect = BlitRect::from(rect.rect);
    let video = Video {
        buffer: include_bytes!("../test-video.mp4").to_vec(),
        rect,
        blit_rect,
    };

    c.bench_function("video frame extraction", |b| {
        b.iter(|| {
            video.get_frame(300).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
