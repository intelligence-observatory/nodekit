use blittle::PositionU;
use bytemuck::cast_slice;
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::Rect;
use nodekit_rs_visual::*;

fn get_rgb_buffer() -> Vec<u8> {
    cast_slice::<u8, [u8; 4]>(include_bytes!("../test_image.raw"))
        .into_iter()
        .map(|pixel| [pixel[0], pixel[1], pixel[2]])
        .flatten()
        .collect::<Vec<u8>>()
}

fn criterion_benchmark(c: &mut Criterion) {
    let mut board = board([255, 0, 255]);

    let visual = VisualBuffer {
        buffer: get_rgb_buffer(),
        rect: BlitRect {
            position: PositionU::default(),
            size: blittle::Size { w: 300, h: 600 },
        },
    };

    c.bench_function("blit visual buffer", |b| b.iter(|| visual.blit(&mut board)));

    let mut buffer = get_rgb_buffer();
    let rect = Rect::new(-0.5, -0.5, 1., 1.);
    c.bench_function("resize visual buffer", |b| {
        b.iter(|| VisualBuffer::new_resized(&mut buffer, 300, 600, rect))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
