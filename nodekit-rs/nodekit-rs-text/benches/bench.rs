use blittle::Size;
use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_text::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 1024;
    let height = 768;

    // Render the text.
    let mut text = Text::default();
    c.bench_function("text rendering", |b| {
        b.iter(|| {
           text
                .render(
                    include_str!("../lorem.txt"),
                    16,
                    Justification {
                        horizontal: JustificationHorizontal::Left,
                        vertical: JustificationVertical::Center,
                    },
                    Size {
                        w: width,
                        h: height,
                    },
                    [0, 0, 0],
                    [200, 200, 200],
                )
                .unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
