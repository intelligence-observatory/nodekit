mod asset;
mod error;

use crate::asset::Asset;
use blittle::blit;
use bytemuck::cast_slice_mut;
pub use error::Error;
use hashbrown::HashSet;
use nodekit_rs_cursor::Cursor;
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
    /// The board bitmap, prior to blitting the cursor.
    board_pre_cursor: Vec<u8>,
    board: Vec<u8>,
    /// The background color.
    color: [u8; STRIDE],
    /// Cached text engine.
    text_engine: nodekit_rs_text::TextEngine,
    /// Cached assets.
    assets: SecondaryMap<CardKey, Asset>,
    visible: HashSet<CardKey>,
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
    /// Returns a raw byte array with shape: (768, 768, 4)
    pub fn render<'py>(&mut self, py: Python<'py>, state: &State) -> PyResult<Bound<'py, PyBytes>> {
        self.blit(state)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        Ok(PyBytes::new(py, &self.board))
    }
}

impl Renderer {
    fn blit(&mut self, state: &State) -> Result<(), Error> {
        // New state.
        if self.is_new_state(state) {
            self.clear(state)?;
        }

        // Erase.
        for card_key in
            state
                .cards
                .iter()
                .filter_map(|(k, card)| {
                    if !card.is_visible(state.t_msec) && self.visible.contains(&k) {
                        Some(state.cards.iter().map(move |a| (k, a)).filter_map(
                            |(k, (o, card))| {
                                if o != k
                                    && card.rect.overlaps(&card.rect)
                                    && self.visible.contains(&o)
                                {
                                    Some(o)
                                } else {
                                    None
                                }
                            },
                        ))
                    } else {
                        None
                    }
                })
                .flatten()
                .collect::<HashSet<CardKey>>()
        {
            self.erase(&card_key, state.cards[card_key].rect);
        }

        // Show.
        for (k, _) in state
            .cards
            .iter()
            .filter(|(_, card)| card.is_visible(state.t_msec))
        {
            match self.assets.get_mut(k).unwrap() {
                Asset::Image(image) => {
                    // Show something new.
                    if !self.visible.contains(&k) {
                        image.blit(&mut self.board_pre_cursor);
                    }
                }
                Asset::Video(video) => {
                    // TODO start time.
                    video
                        .blit(state.t_msec, &mut self.board_pre_cursor)
                        .map_err(Error::Video)?;
                }
            }
            // Remember visibility.
            if !self.visible.contains(&k) {
                self.visible.insert(k);
            }
        }

        // Copy to the final blit.
        self.board.copy_from_slice(&self.board_pre_cursor);
        // Blit the cursor.
        self.cursor.blit(&state.pointer, &mut self.board);
        Ok(())
    }

    fn is_new_state(&self, state: &State) -> bool {
        self.id.is_none_or(|id| id != state.id)
    }

    fn clear(&mut self, state: &State) -> Result<(), Error> {
        // Get the background color.
        self.color = parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?;
        // Fill the board.
        if self.board_pre_cursor.is_empty() {
            self.board_pre_cursor = board(self.color);
            self.board = self.board_pre_cursor.clone();
        } else {
            cast_slice_mut::<u8, [u8; STRIDE]>(&mut self.board_pre_cursor).fill(self.color);
        }
        // Clear the visible keys.
        self.visible.clear();
        // Set the ID.
        self.id = Some(state.id);
        // Clear the asset caches.
        self.assets.clear();
        // Cache assets.
        self.cache(state)
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
                        Asset::Image(
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

    /// Erase a section of the board by filling it with the background color.
    fn erase(&mut self, key: &CardKey, rect: Rect) {
        let width = size_coordinate(rect.size.w);
        let height = size_coordinate(rect.size.h);
        // An empty image.
        let erasure = bitmap_rgb(width, height, self.color);
        // Blit it.
        let rgb_rect = RgbRect::from(rect);
        blit(
            &erasure,
            &rgb_rect.size,
            &mut self.board_pre_cursor,
            &rgb_rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
        // Remove the card.
        self.visible.remove(key);
    }
}
