use blittle::PositionU;
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::Rect;
use nodekit_rs_visual::*;

fn get_rgb_buffer() -> Vec<u8> {
    include_bytes!("../test_files/rgb.raw").to_vec()
}

fn get_rgba_buffer() -> Vec<u8> {
    include_bytes!("../test_files/rgba.raw").to_vec()
}

fn criterion_benchmark(c: &mut Criterion) {
    let mut board = board([255, 0, 255]);

    let rgb = RgbBuffer {
        buffer: get_rgb_buffer(),
        rect: RgbRect {
            position: PositionU::default(),
            size: blittle::Size { w: 300, h: 600 },
        },
    };

    c.bench_function("blit rgb buffer", |b| b.iter(|| rgb.blit(&mut board)));

    let mut rgb = get_rgb_buffer();
    let rect = Rect::new(-0.5, -0.5, 1., 1.);
    c.bench_function("resize rgb buffer", |b| {
        b.iter(|| RgbBuffer::new_resized(&mut rgb, 300, 600, rect))
    });

    let src_w = 300;
    let src_h = 600;
    let rgba = RgbaBuffer {
        buffer: get_rgba_buffer(),
        rects: RgbaRects {
            src: RgbaRect {
                xy0: PositionU { x: 0, y: 0 },
                xy1: PositionU { x: src_w, y: src_h },
            },
            dst: RgbaRect {
                xy0: PositionU { x: 0, y: 0 },
                xy1: PositionU {
                    x: BOARD_D / 2,
                    y: BOARD_D,
                },
            },
        },
    };

    c.bench_function("blit rgba buffer", |b| b.iter(|| rgba.blit(&mut board)));

    let mut rgba = get_rgba_buffer();
    let rect = Rect::new(-0.5, -0.5, 1., 1.);
    c.bench_function("resize rgba buffer", |b| {
        b.iter(|| RgbaBuffer::new_resized(&mut rgba, 300, 600, rect))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
