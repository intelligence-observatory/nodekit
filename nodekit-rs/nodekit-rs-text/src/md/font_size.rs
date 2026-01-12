//! http://zuga.net/articles/html-heading-elements/

use super::Error;
use cosmic_text::Metrics;

pub const LINE_HEIGHT: f32 = 1.2;
pub const HEADER_LINE_HEIGHT: f32 = 2.;

macro_rules! metrics {
    ($self:ident, $h:expr) => {
        Ok(Metrics::new($h, $self.header_height))
    };
}

#[derive(Copy, Clone, Debug)]
pub struct FontSize {
    pub font_size: f32,
    pub font_usize: usize,
    pub font_isize: isize,
    pub line_height: f32,
    pub header_height: f32,
    pub line_height_usize: usize,
    pub header_height_usize: usize,
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
        let line_height = font_size * LINE_HEIGHT;
        let header_height = font_size * HEADER_LINE_HEIGHT;
        Self {
            font_size,
            line_height,
            header_height,
            h1: font_size * 2.,
            h2: font_size * 1.5,
            h3: font_size * 1.17,
            h4: font_size,
            h5: font_size,
            h6: font_size * 0.67,
            font_usize: font_size as usize,
            font_isize: font_size as isize,
            line_height_usize: line_height as usize,
            header_height_usize: header_height as usize,
        }
    }
}

impl FontSize {
    pub const fn header_metrics(&self, depth: u8) -> Result<Metrics, Error> {
        match depth {
            1 => metrics!(self, self.h1),
            2 => metrics!(self, self.h2),
            3 => metrics!(self, self.h3),
            4 => metrics!(self, self.h4),
            5 => metrics!(self, self.h5),
            6 => metrics!(self, self.h6),
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
