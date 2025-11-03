//! http://zuga.net/articles/html-heading-elements/

use super::Error;
use cosmic_text::Metrics;

pub const LINE_HEIGHT_FACTOR: f32 = 1.2;

macro_rules! metrics {
    ($self:ident, $h:expr) => {
        Ok(Metrics::new($h, $self.line_height))
    };
}

#[derive(Copy, Clone, Debug)]
pub struct FontSize {
    pub font_size: f32,
    pub line_height: f32,
    h1: f32,
    h2: f32,
    h3: f32,
    h4: f32,
    h5: f32,
    h6: f32,
}

impl FontSize {
    pub fn new(font_size: u16) -> Self {
        let font_size = font_size as f32;
        Self {
            font_size,
            line_height: font_size * LINE_HEIGHT_FACTOR,
            h1: font_size * 2.,
            h2: font_size * 1.5,
            h3: font_size * 1.17,
            h4: font_size,
            h5: font_size,
            h6: font_size * 0.67,
        }
    }
}

impl FontSize {
    pub const fn header_metrics(&self, depth: u8) -> Result<Metrics, Error> {
        match depth {
            0 => metrics!(self, self.h1),
            1 => metrics!(self, self.h2),
            2 => metrics!(self, self.h3),
            3 => metrics!(self, self.h4),
            4 => metrics!(self, self.h5),
            5 => metrics!(self, self.h6),
            other => Err(Error::HeaderDepth(other)),
        }
    }
}

impl From<&FontSize> for Metrics {
    fn from(value: &FontSize) -> Self {
        Self {
            font_size: value.font_size,
            line_height: value.line_height,
        }
    }
}
