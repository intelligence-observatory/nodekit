mod asset;
mod error;

use asset::Asset;
use blittle::ClippedRect;
pub use error::Error;
use itertools::Itertools;
use nodekit_rs_card::CardType;
use nodekit_rs_image::*;
use nodekit_rs_state::*;
use nodekit_rs_visual::*;
use numpy::{PyArray3, PyArrayMethods};
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SecondaryMap;
use std::ops::DerefMut;
use uuid::Uuid;

macro_rules! render_asset {
    ($self:ident, $asset:expr, $state:ident) => {{
        match $asset {
            Asset::Image(image) => {
                $self.board.blit(image);
            }
            Asset::Text(text) => {
                text.blit(&mut $self.board);
            }
            Asset::Video(video) => {
                video.get_frame($state.t_msec).map_err(Error::Video)?;
                $self.board.blit_rgb(&video.rgb_buffer);
            }
        }
    }};
}

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
    /// These assets need to be cleared and re-filled per frame.
    overlaps: SecondaryMap<CardKey, Vec<CardKey>>,
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

    /// Returns an empty numpy array that can be used by `self.render_to(state, board)`.
    /// The shape of the returned array is: `(768, 768, 3)`.
    #[staticmethod]
    pub fn empty_board<'py>(py: Python<'py>) -> Bound<'py, PyArray3<u8>> {
        PyArray3::zeros(py, (BOARD_D, BOARD_D, STRIDE), false)
    }

    /// Render `state` and copy the rendered bitmap into `board`.
    ///
    /// This is faster than `self.render(state) because it doesn't allocate a new array.
    ///
    /// `board`'s data type MUST be `numpy.unit8` and its shape MUST be `(768, 768, 3)`.
    /// See: `Renderer.empty_board()`.
    pub fn render_to<'py>(
        &mut self,
        state: Bound<'py, State>,
        board: Bound<'py, PyArray3<u8>>,
    ) -> PyResult<()> {
        let bitmap = self
            .blit(state.borrow_mut().deref_mut())
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        unsafe {
            board.as_slice_mut()?.copy_from_slice(bitmap);
        }
        Ok(())
    }

    /// Render `state`.
    /// Returns a numpy array with shape: `(768, 768, 3)`.
    ///
    /// This is slower than `self.render_to(state, board)` because it needs to allocate a new array.
    pub fn render<'py>(
        &mut self,
        py: Python<'py>,
        state: Bound<'py, State>,
    ) -> PyResult<Bound<'py, PyArray3<u8>>> {
        let board = self
            .blit(state.borrow_mut().deref_mut())
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        let arr = PyArray3::zeros(py, (BOARD_D, BOARD_D, STRIDE), false);
        unsafe {
            arr.as_slice_mut()?.copy_from_slice(board);
        }
        Ok(arr)
    }
}

impl Renderer {
    fn blit(&mut self, state: &mut State) -> Result<&[u8], Error> {
        if self.is_new_state(state) {
            // New state.
            self.start(state)?;
        } else {
            // Re-render dirty assets.
            for card_key in self.get_dirty_cards(state) {
                // Render.
                render_asset!(self, &mut self.assets[card_key], state);
                // Mark as not dirty.
                state.cards[card_key].dirty = false;
            }
        }

        // Copy to the final blit.
        Ok(self.board.blit_cursor(
            &self.cursor.0,
            &Cursor::rect(state.pointer.x, state.pointer.y),
        ))
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
                } else {
                    // Clear the board and re-cache.
                    *id = state.id;
                    self.fill_and_cache(state)?;
                }
            }
            None => {
                // Start the first run and cache.
                self.id = Some(state.id);
                self.fill_and_cache(state)?;
            }
        }

        // Initial blit.
        for asset in self.assets.values_mut() {
            render_asset!(self, asset, state);
        }

        Ok(())
    }

    fn fill_and_cache(&mut self, state: &State) -> Result<(), Error> {
        // Clear the asset caches.
        self.assets.clear();
        // Cache assets.
        self.cache(state)?;

        // Set overlaps.
        let rects = state
            .cards
            .iter()
            .filter_map(|(k, _)| self.assets[k].rect().map(|rect| (k, rect)))
            .collect::<SecondaryMap<CardKey, ClippedRect>>();
        self.overlaps = rects
            .iter()
            .map(|(k_a, rect_a)| {
                (
                    k_a,
                    rects
                        .iter()
                        .filter_map(|(k_b, rect_b)| {
                            if k_a != k_b && rect_a.overlaps(rect_b) {
                                Some(k_b)
                            } else {
                                None
                            }
                        })
                        .collect(),
                )
            })
            .collect();

        self.board
            .fill(parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?);
        Ok(())
    }

    fn cache(&mut self, state: &State) -> Result<(), Error> {
        for (card_key, card) in state.cards.iter() {
            match &card.card_type {
                CardType::Image(image) => {
                    if let Some(image) = load_image(image, &card.region).map_err(Error::Image)? {
                        self.assets.insert(card_key, Asset::Image(image));
                    }
                }
                CardType::Text(text_card) => {
                    if let Some(buffers) = self
                        .text_engine
                        .render(text_card, &card.region)
                        .map_err(Error::Text)?
                    {
                        self.assets.insert(card_key, Asset::Text(buffers));
                    }
                }
                CardType::Video { asset, looped: _ } => {
                    if let Some(video) =
                        nodekit_rs_video::Video::new(asset, &card.region).map_err(Error::Video)?
                    {
                        self.assets.insert(card_key, Asset::Video(video));
                    }
                }
            }
        }
        Ok(())
    }

    fn get_dirty_cards(&self, state: &State) -> Vec<CardKey> {
        state
            .cards
            .iter()
            .filter(|(_, v)| v.dirty)
            .flat_map(|(k, _)| {
                let mut overlaps = vec![k];
                overlaps.extend_from_slice(&self.overlaps[k]);
                overlaps
            })
            .unique()
            .sorted_by(|a, b| {
                state.cards[*a]
                    .region
                    .z_index
                    .cmp(&state.cards[*b].region.z_index)
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use crate::Renderer;
    use nodekit_rs_card::*;
    use nodekit_rs_state::{CardKey, State};
    use std::path::PathBuf;

    #[test]
    fn test_render() {
        let cards = vec![image_card(), video_card(), text_card()];

        let mut state = State::from_cards("#AAAAAAFF".to_string(), cards);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "000.png");
        render_image(&mut renderer, &mut state, 100, "100.png");
        render_image(&mut renderer, &mut state, 200, "200.png");
        render_image(&mut renderer, &mut state, 600, "600.png");
    }

    fn image_card() -> Card {
        let image_path = PathBuf::from("../nodekit-rs-image/test_image.png");
        assert!(image_path.exists());
        Card {
            region: Region {
                x: -0.4,
                y: -0.4,
                w: 0.3,
                h: 0.3,
                z_index: Some(0),
            },
            card_type: CardType::Image(Asset::Path(image_path)),
            dirty: false,
        }
    }

    fn video_card() -> Card {
        let video_path = PathBuf::from("../nodekit-rs-video/test-video.mp4");
        Card {
            region: Region {
                x: 0.,
                y: 0.1,
                w: 0.4,
                h: 0.6,
                z_index: Some(1),
            },
            card_type: CardType::Video {
                asset: Asset::Path(video_path),
                looped: false,
            },
            dirty: false,
        }
    }

    fn text_card() -> Card {
        Card {
            region: Region {
                x: -0.5,
                y: -0.5,
                w: 1.,
                h: 1.,
                z_index: Some(2),
            },
            card_type: CardType::Text(TextCard {
                text: include_str!("../../nodekit-rs-text/lorem.txt").to_string(),
                font_size: 0.02,
                justification_horizontal: JustificationHorizontal::Left,
                justification_vertical: JustificationVertical::Center,
                text_color: "#003300FF".to_string(),
                background_color: "#EE00EE11".to_string(),
            }),
            dirty: false,
        }
    }

    fn render_image(renderer: &mut Renderer, state: &mut State, t_msec: u64, filename: &str) {
        state.t_msec = t_msec;
        renderer.start(&state).unwrap();
        nodekit_rs_png::board_to_png(filename, renderer.blit(state).unwrap());
    }

    #[test]
    fn test_dirty_rects() {
        let mut renderer = Renderer::new();
        let mut state = State::from_cards("#AAAAAAFF".to_string(), vec![image_card()]);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));
        state.cards.clear();
        state.cards.insert(text_card());
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        state = State::from_cards("#AAAAAAFF".to_string(), vec![image_card(), text_card()]);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 2);
        for o in renderer.overlaps.values() {
            assert_eq!(o.len(), 1)
        }
        assert!(state.cards.values().all(|card| !card.dirty));

        state = State::from_cards("#AAAAAAFF".to_string(), vec![video_card()]);
        renderer.start(&state).unwrap();
        // Always re-blit a video.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));
        state.set_t_msec(1);
        assert!(state.cards.values().all(|card| card.dirty));

        state = State::from_cards(
            "#AAAAAAFF".to_string(),
            vec![image_card(), text_card(), video_card()],
        );
        renderer.start(&state).unwrap();
        // Always re-blit a video.
        assert_eq!(renderer.overlaps.len(), 3);
        let card_keys = state.cards.keys().collect::<Vec<CardKey>>();
        let image_key = card_keys[0];
        let text_key = card_keys[1];
        let video_key = card_keys[2];
        assert_eq!(renderer.overlaps[image_key].len(), 1);
        assert!(renderer.overlaps[image_key].contains(&text_key));
        assert_eq!(renderer.overlaps[text_key].len(), 2);
        assert!(renderer.overlaps[text_key].contains(&image_key));
        assert!(renderer.overlaps[text_key].contains(&video_key));
        assert_eq!(renderer.overlaps[video_key].len(), 1);
        assert!(renderer.overlaps[video_key].contains(&text_key));
    }
}
