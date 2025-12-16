use blittle::{ClippedRect, PositionI, Size};
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::Region;
use nodekit_rs_visual::*;

fn get_rgb_buffer() -> Vec<u8> {
    include_bytes!("../test_files/rgb.raw").to_vec()
}

fn get_rgba_buffer() -> Vec<u8> {
    include_bytes!("../test_files/rgba.raw").to_vec()
}

fn criterion_benchmark(c: &mut Criterion) {
    let mut board = Board::new([255, 0, 255]);

    let rect = ClippedRect::new(PositionI::default(), BOARD_SIZE, Size { w: 300, h: 600 }).unwrap();

    let rgb = RgbBuffer::new(get_rgb_buffer(), rect.clone());

    c.bench_function("blit rgb buffer", |b| b.iter(|| board.blit_rgb(&rgb)));

    let mut rgb = get_rgb_buffer();
    let region = Region::default();
    c.bench_function("resize rgb buffer", |b| {
        b.iter(|| RgbBuffer::new_resized(&mut rgb, Size { w: 300, h: 600 }, &region))
    });

    let rgba = RgbaBuffer::new(rect, [255, 0, 255, 255]);

    c.bench_function("blit rgba buffer", |b| b.iter(|| board.overlay_rgba(&rgba)));

    let mut rgba = get_rgba_buffer();
    c.bench_function("resize rgba buffer", |b| {
        b.iter(|| RgbaBuffer::new_resized(&mut rgba, Size { w: 300, h: 600 }, &region))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
