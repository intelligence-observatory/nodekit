mod asset;
mod error;

use crate::asset::Asset;
use blittle::blit;
use bytemuck::cast_slice_mut;
pub use error::Error;
use hashbrown::HashSet;
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
        let board = self.blit(state)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        Ok(PyBytes::new(py, board))
    }
}

impl Renderer {
    fn blit(&mut self, state: &State) -> Result<&[u8], Error> {
        // New state.
        if self.is_new_state(state) {
            self.clear(state)?;
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
                    self.board.blit_rgb(&video.get_frame(state.t_msec).map_err(Error::Video)?);
                }
            }
        }

        // Copy to the final blit.
        Ok(self.board.blit_cursor(&self.cursor.0, &Cursor::rect(state.pointer)))
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
                }
                else {
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
        self.board.fill(parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?);
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
