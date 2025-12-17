use criterion::{Criterion, criterion_group, criterion_main};
use nodekit_rs_models::{JustificationHorizontal, JustificationVertical, Region, TextCard};
use nodekit_rs_text::*;

pub fn criterion_benchmark(c: &mut Criterion) {
    let card = TextCard {
        text: include_str!("../lorem.txt").to_string(),
        font_size: 0.02,
        justification_horizontal: JustificationHorizontal::Left,
        justification_vertical: JustificationVertical::Center,
        text_color: "#000000FF".to_string(),
        background_color: "#AAAAAAFF".to_string(),
    };
    let region = Region::default();

    // Render the text.
    let mut text = TextEngine::default();
    c.bench_function("text rendering", |b| {
        b.iter(|| {
            text.render_text_card(&card, &region).unwrap();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
