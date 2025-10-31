mod md;

use cosmic_text::fontdb::{ID, Source};
use cosmic_text::{Attrs, AttrsOwned, Buffer, FontSystem, Metrics, SwashCache};
use std::sync::Arc;

pub struct Text {
    font_system: FontSystem,
    swash_cache: SwashCache,
    regular: String,
    italic: String,
}

impl Text {
    pub fn render(&mut self, font_size: f32, line_height: f32) {
        let metrics = Metrics::new(font_size, line_height);
        let mut buffer = Buffer::new(&mut self.font_system, metrics);
        let mut buffer = buffer.borrow_with(&mut self.font_system);
    }
}

impl Default for Text {
    fn default() -> Self {
        let mut font_system = FontSystem::new();
        let regular = font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-VariableFont_opsz,wght.ttf"
            ))))[0];
        let italic = font_system
            .db_mut()
            .load_font_source(Source::Binary(Arc::new(include_bytes!(
                "../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf"
            ))))[0];
        let regular = font_system.db().face(regular).unwrap().families[0]
            .0
            .clone();
        let italic = font_system.db().face(italic).unwrap().families[0].0.clone();
        let swash_cache = SwashCache::new();
        Self {
            font_system,
            swash_cache,
            regular,
            italic,
        }
    }
}
