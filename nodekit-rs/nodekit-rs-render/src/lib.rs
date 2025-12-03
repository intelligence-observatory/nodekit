mod asset;
mod error;

use crate::asset::Asset;
pub use error::Error;
use nodekit_rs_image::*;
use nodekit_rs_models::*;
use nodekit_rs_visual::*;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3::types::PyBytes;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SecondaryMap;
use uuid::Uuid;

/// Render a `State` while storing an internal cache of loaded data (fonts, video buffers, etc.)
#[pyclass]
#[gen_stub_pyclass]
#[derive(Default)]
pub struct Renderer {
    board: Board,
    /// Cached text engine.
    text_engine: nodekit_rs_text::TextEngine,
    /// Cached assets.
    assets: SecondaryMap<CardKey, Asset>,
    /// The known state ID.
    id: Option<Uuid>,
    cursor: Cursor,
}

#[pymethods]
#[gen_stub_pymethods]
impl Renderer {
    #[new]
    pub fn new() -> Self {
        Self::default()
    }

    /// Render `state`.
    /// Returns a raw byte array with shape: (768, 768, 3)
    pub fn render<'py>(&mut self, py: Python<'py>, state: &State) -> PyResult<Bound<'py, PyBytes>> {
        let board = self
            .blit(state)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        Ok(PyBytes::new(py, board))
    }
}

impl Renderer {
    fn blit(&mut self, state: &State) -> Result<&[u8], Error> {
        // New state.
        if self.is_new_state(state) {
            self.start(state)?;
        }

        // Show.
        for (k, _) in state
            .cards
            .iter()
            .filter(|(_, card)| card.is_visible(state.t_msec))
        {
            match self.assets.get_mut(k).unwrap() {
                Asset::Image(image) => {
                    self.board.blit(image);
                }
                Asset::Text(text) => {
                    for text in text {
                        self.board.overlay_rgba(text);
                    }
                }
                Asset::Video(video) => {
                    // TODO start time.
                    self.board
                        .blit_rgb(&video.get_frame(state.t_msec).map_err(Error::Video)?);
                }
            }
        }

        // Copy to the final blit.
        Ok(self
            .board
            .blit_cursor(&self.cursor.0, &Cursor::rect(state.pointer)))
    }

    fn is_new_state(&self, state: &State) -> bool {
        self.id.is_none_or(|id| id != state.id)
    }

    fn start(&mut self, state: &State) -> Result<(), Error> {
        match self.id.as_mut() {
            Some(id) => {
                if *id == state.id {
                    // Clear the board. Keep cached assets.
                    self.board.clear();
                    Ok(())
                } else {
                    // Clear the board and re-cache.
                    *id = state.id;
                    self.fill_and_cache(state)
                }
            }
            None => {
                // Start the first run and cache.
                self.id = Some(state.id);
                self.fill_and_cache(state)
            }
        }
    }

    fn fill_and_cache(&mut self, state: &State) -> Result<(), Error> {
        // Clear the asset caches.
        self.assets.clear();
        // Cache assets.
        self.cache(state)?;
        self.board
            .fill(parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?);
        Ok(())
    }

    fn cache(&mut self, state: &State) -> Result<(), Error> {
        for (key, card) in state.cards.iter() {
            match &card.card_type {
                CardType::Image(image) => {
                    self.assets.insert(
                        key,
                        Asset::Image(load(image, card.rect).map_err(Error::Image)?),
                    );
                }
                CardType::Text(text) => {
                    self.assets.insert(
                        key,
                        Asset::Text(
                            self.text_engine
                                .render(card.rect, text)
                                .map_err(Error::Text)?,
                        ),
                    );
                }
                CardType::Video(video) => {
                    self.assets.insert(
                        key,
                        Asset::Video(
                            nodekit_rs_video::Video::new(card, video).map_err(Error::Video)?,
                        ),
                    );
                }
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::Renderer;
    use nodekit_rs_models::*;
    use std::path::PathBuf;

    #[test]
    fn test_render() {
        let image_path = PathBuf::from("../nodekit-rs-image/test_image.png");
        assert!(image_path.exists());
        let video_path = PathBuf::from("../nodekit-rs-video/test-video.mp4");
        assert!(video_path.exists());

        let cards = vec![
            Card::image_card(
                Rect {
                    position: Position { x: -0.4, y: -0.4 },
                    size: Size { w: 0.3, h: 0.3 },
                },
                Timer::new(0, None),
                image_path,
                Some(0),
            ),
            Card::video_card(
                Rect {
                    position: Position { x: 0., y: 0.1 },
                    size: Size { w: 0.4, h: 0.6 },
                },
                Timer::new(100, Some(500)),
                video_path,
                false,
                Some(1),
            ),
            Card::text_card(
                Rect {
                    position: Position { x: 0., y: 0. },
                    size: Size { w: 1., h: 1. },
                },
                Timer::new(200, None),
                include_str!("../../nodekit-rs-text/lorem.txt").to_string(),
                0.02,
                JustificationHorizontal::Left,
                JustificationVertical::Center,
                "#003300FF",
                "#EEEEEE11",
                Some(2),
            ),
        ];

        let mut state = State::new("#AAAAAAFF".to_string(), cards);
        let mut renderer = Renderer::default();
        renderer.start(&state).unwrap();

        render_image(&mut renderer, &mut state, 0, "000.png");
        render_image(&mut renderer, &mut state, 100, "100.png");
        render_image(&mut renderer, &mut state, 200, "200.png");
        render_image(&mut renderer, &mut state, 600, "600.png");
    }

    fn render_image(renderer: &mut Renderer, state: &mut State, t_msec: u64, filename: &str) {
        state.t_msec = t_msec;
        nodekit_rs_png::board_to_png(filename, renderer.blit(state).unwrap());
    }
}
