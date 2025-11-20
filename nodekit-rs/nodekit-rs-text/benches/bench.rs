use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::{JustificationHorizontal, JustificationVertical, Position, Rect};
use nodekit_rs_text::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let width = 1024;
    let height = 768;

    let card = nodekit_rs_models::Text {
        text: include_str!("../lorem.txt").to_string(),
        font_size: 0.02,
        justification_horizontal: JustificationHorizontal::Left,
        justification_vertical: JustificationVertical::Center,
        text_color: "#000000FF".to_string(),
        background_color: "#AAAAAAFF".to_string(),
    };
    let rect = Rect {
        position: Position { x: -0.5, y: -0.5 },
        size: nodekit_rs_models::Size { w: 1., h: 1. },
    };

    // Render the text.
    let mut text = TextEngine::default();

    // Render the text.
    let mut text = TextEngine::default();
    c.bench_function("text rendering", |b| {
        b.iter(|| {
            text.render(rect, &card).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
