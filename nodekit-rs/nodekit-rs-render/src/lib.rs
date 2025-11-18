mod error;

use blittle::blit;
use bytemuck::cast_slice_mut;
pub use error::Error;
use nodekit_rs_image::*;
use nodekit_rs_models::*;
use nodekit_rs_visual::*;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3::types::PyBytes;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SecondaryMap;

/// Render a `State` while storing an internal cache of loaded data (fonts, video buffers, etc.)
#[pyclass]
#[gen_stub_pyclass]
#[derive(Default)]
pub struct Renderer {
    /// The board bitmap.
    board: Vec<u8>,
    /// The background color.
    color: [u8; STRIDE],
    /// Cached text engine.
    text: nodekit_rs_text::Text,
    /// Cached video buffers.
    videos: SecondaryMap<CardKey, nodekit_rs_video::Video>,
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
        // Clear the video cache and the visual board.
        if state.t_msec == 0 || self.board.is_empty() {
            self.clear(state)?;
        }
        for (card_key, card) in state.get_ordered_cards().iter() {
            match card.status(state.t_msec) {
                Status::Pending | Status::Finished => (),
                Status::StartedNow | Status::Active => match &card.card_type {
                    CardType::Image(image) => {
                        blit_image(image, card.rect, &mut self.board).map_err(Error::Image)?
                    }
                    CardType::Text(text) => self
                        .text
                        .blit(card, text, &mut self.board)
                        .map_err(Error::Text)?,
                    CardType::Video(video) => {
                        let t_msec = video.t_msec - state.t_msec;
                        self.videos[*card_key]
                            .blit(t_msec, &mut self.board)
                            .map_err(Error::Video)?
                    }
                },
                Status::EndedNow => {
                    self.erase(card.rect);
                }
            }
        }
        Ok(())
    }

    /// Erase a section of the board by filling it with the background color.
    fn erase(&mut self, rect: Rect) {
        let width = size_coordinate(rect.size.w);
        let height = size_coordinate(rect.size.h);
        // An empty image.
        let erasure = bitmap(width, height, self.color);
        // Blit it.
        let blit_rect = BlitRect::from(rect);
        blit(
            &erasure,
            &blit_rect.size,
            &mut self.board,
            &blit_rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
    }

    fn clear(&mut self, state: &State) -> Result<(), Error> {
        self.color = parse_color(&state.board_color).map_err(Error::ParseColor)?;
        // Fill the board.
        if self.board.is_empty() {
            self.board = board(self.color);
        } else {
            cast_slice_mut::<u8, [u8; STRIDE]>(&mut self.board).fill(self.color);
        }

        // Clear the video buffers.
        self.videos.clear();

        // Load videos into memory.
        for (key, (card, video)) in state.cards.iter().filter_map(|(key, card)| {
            if let CardType::Video(video) = &card.card_type {
                Some((key, (card, video)))
            } else {
                None
            }
        }) {
            self.videos.insert(
                key,
                nodekit_rs_video::Video::new(card, video).map_err(Error::Video)?,
            );
        }

        self.blit(state)
    }
}
