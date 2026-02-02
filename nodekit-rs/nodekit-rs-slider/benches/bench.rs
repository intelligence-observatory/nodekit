use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::{Region, card::*};
use nodekit_rs_visual::Board;

pub fn criterion_benchmark(c: &mut Criterion) {
    let mut board = Board::new([255, 255, 255]);
    let slider_card = Slider {
        num_bins: 6,
        bin: 0,
        show_bin_markers: true,
        orientation: SliderOrientation::Horizontal,
        committed: false,
    };
    let region = Region {
        x: 0,
        y: 300,
        w: 700,
        h: 90,
        z_index: None,
    };
    let slider = nodekit_rs_slider::Slider::new(&region, &slider_card)
        .unwrap()
        .unwrap();

    // Render the text.
    c.bench_function("slider rendering", |b| {
        b.iter(|| {
            slider.blit(&slider_card, &mut board);
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
