//! http://zuga.net/articles/html-heading-elements/

use super::Error;
use cosmic_text::Metrics;

const FONT_SIZE: f32 = 16.;
pub const FONT_SIZE_USIZE: usize = 16;
pub const FONT_SIZE_ISIZE: isize = 16;
/// FONT_SIZE * 1.2
const LINE_HEIGHT: f32 = 19.2;
pub const LINE_HEIGHT_ISIZE: isize = 19;
const H1_SIZE: f32 = 32.;
const H2_SIZE: f32 = 24.;
const H3_SIZE: f32 = 18.72;
const H4_SIZE: f32 = 16.;
const H5_SIZE: f32 = 16.;
const H6_SIZE: f32 = 10.72;
pub const FONT_METRICS: Metrics = Metrics::new(FONT_SIZE, LINE_HEIGHT);

macro_rules! metrics {
    ($h:ident) => {
        Ok(Metrics::new($h, LINE_HEIGHT))
    };
}

pub const fn header_metrics(depth: u8) -> Result<Metrics, Error> {
    match depth {
        0 => metrics!(H1_SIZE),
        1 => metrics!(H2_SIZE),
        2 => metrics!(H3_SIZE),
        3 => metrics!(H4_SIZE),
        4 => metrics!(H5_SIZE),
        5 => metrics!(H6_SIZE),
        other => Err(Error::HeaderDepth(other)),
    }
}
