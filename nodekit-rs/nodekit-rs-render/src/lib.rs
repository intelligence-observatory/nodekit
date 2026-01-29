mod asset;
mod error;
mod sensor;

use asset::Asset;
use blittle::ClippedRect;
pub use error::Error;
use itertools::Itertools;
use nodekit_rs_image::*;
use nodekit_rs_models::board::{HORIZONTAL, STRIDE, VERTICAL};
use nodekit_rs_models::card::{Card, CardKey, CardType, VideoCard};
use nodekit_rs_models::sensor::Sensor;
use nodekit_rs_state::*;
use nodekit_rs_visual::*;
use numpy::{PyArray3, PyArrayMethods, PyUntypedArrayMethods};
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
            Asset::TextEntry(text) => {
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
    /// Blit to this board.
    board: Board,
    /// Cached text engine.
    text_engine: nodekit_rs_text::TextEngine,
    /// Cached assets.
    assets: SecondaryMap<CardKey, Asset>,
    /// These assets need to be cleared and re-filled per frame.
    overlaps: SecondaryMap<CardKey, Vec<CardKey>>,
    /// Sensor-related bitmaps such as hovering overlays.
    sensor: sensor::Sensor,
    /// The known state ID.
    id: Option<Uuid>,
    cursor: Cursor,
    hide_pointer: bool,
}

#[pymethods]
#[gen_stub_pymethods]
impl Renderer {
    #[new]
    pub fn new() -> Self {
        Self::default()
    }

    /// Returns an empty numpy array that can be used by `self.render_to(state, board)`.
    /// The shape of the returned array is: `(768, 1024, 3)`.
    #[staticmethod]
    pub fn empty_board<'py>(py: Python<'py>) -> Bound<'py, PyArray3<u8>> {
        PyArray3::zeros(py, (VERTICAL.u_size, HORIZONTAL.u_size, STRIDE), false)
    }

    /// Render `state` and copy the rendered bitmap into `board`.
    ///
    /// This is faster than `self.render(state) because it doesn't allocate a new array.
    ///
    /// `board`'s data type MUST be `numpy.unit8` and its shape MUST be `(768, 1024, 3)`.
    /// See: `Renderer.empty_board()`.
    pub fn render_to<'py>(
        &mut self,
        state: Bound<'py, State>,
        board: Bound<'py, PyArray3<u8>>,
    ) -> PyResult<()> {
        let shape = board.shape();
        if shape.len() == 3
            && shape[0] == VERTICAL.u_size
            && shape[1] == HORIZONTAL.u_size
            && shape[2] == STRIDE
        {
            let bitmap = self
                .blit(state.borrow_mut().deref_mut())
                .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
            unsafe {
                board.as_slice_mut()?.copy_from_slice(bitmap);
            }
            Ok(())
        } else {
            Err(PyRuntimeError::new_err(format!(
                "Expected a numpy array of shape [{}, {}, {STRIDE}] but got: {:?}",
                VERTICAL.u_size, HORIZONTAL.u_size, shape
            )))
        }
    }

    /// Render `state`.
    /// Returns a numpy array with shape: `(768, 1024, 3)`.
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
        let arr = Renderer::empty_board(py);
        unsafe {
            arr.as_slice_mut()?.copy_from_slice(board);
        }
        Ok(arr)
    }

    /// Set whether the pointer is visible.
    pub fn set_pointer_visibility(&mut self, visible: bool) {
        self.hide_pointer = !visible;
    }
}

impl Renderer {
    fn blit(&mut self, state: &mut State) -> Result<&[u8], Error> {
        if self.is_new_state(state) {
            // New state.
            self.start(state)?;
        } else {
            // Get all assets that are being hovered over.
            let hovering_over = state.get_hovering_over();
            // Get all selected states.
            let selected = state.get_selected();
            // Get dirty cards.
            let dirty_cards = self.get_dirty(state);
            // Erase.
            self.erase(&dirty_cards);
            // Re-render dirty assets.
            for card_key in dirty_cards {
                // Set text entry text.
                if let CardType::TextEntry(card) = &state.cards[card_key].card_type
                    && let Asset::TextEntry(asset) = &mut self.assets[card_key]
                    && let Some(text_entry) = self
                        .text_engine
                        .render_text_entry(card, &state.cards[card_key].region)
                        .map_err(Error::Text)?
                {
                    *asset = text_entry;
                }

                // Render.
                render_asset!(self, &mut self.assets[card_key], state);

                // Blit the hovering overlay.
                if hovering_over.contains(&card_key)
                    && let Some(overlay) = self.sensor.get_hover_overlay(card_key)
                {
                    self.board.overlay_rgba(overlay);
                }

                // Blit the selection border.
                if selected.contains(&card_key)
                    && let Some(overlay) = self.sensor.get_select_border(card_key)
                {
                    self.board.overlay_rgba(overlay);
                }

                // Mark as not dirty.
                state.cards[card_key].dirty = false;
            }
        }

        if self.hide_pointer {
            Ok(self.board.get_board_without_cursor())
        } else {
            // Copy to the final blit.
            Ok(self.board.blit_cursor(
                &self.cursor.0,
                &Cursor::rect(state.pointer.x, state.pointer.y),
            ))
        }
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

        // Get all assets that are being hovered over.
        let hovering_over = state.get_hovering_over();
        // Get all selected states.
        let selected = state.get_selected();

        // Initial blit.
        for (card_key, asset) in self.assets.iter_mut() {
            render_asset!(self, asset, state);

            // Blit the hovering overlay.
            if hovering_over.contains(&card_key)
                && let Some(overlay) = self.sensor.get_hover_overlay(card_key)
            {
                self.board.overlay_rgba(overlay);
            }

            // Blit the selection border.
            if selected.contains(&card_key)
                && let Some(overlay) = self.sensor.get_select_border(card_key)
            {
                self.board.overlay_rgba(overlay);
            }
        }

        Ok(())
    }

    fn fill_and_cache(&mut self, state: &State) -> Result<(), Error> {
        // Clear the asset caches.
        self.assets.clear();
        self.sensor.clear();
        // Cache assets.
        self.cache_cards(state)?;
        self.cache_sensor(state)?;

        // Set overlaps.
        let rects = self
            .assets
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

        // Fill the board.
        self.board
            .fill(parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?);
        Ok(())
    }

    fn get_asset(&mut self, card: &Card) -> Result<Option<Asset>, Error> {
        match &card.card_type {
            CardType::Image(image) => Ok(load_image(image, &card.region)
                .map_err(Error::Image)?
                .map(Asset::Image)),
            CardType::Text(text_card) => Ok(self
                .text_engine
                .render_text_card(text_card, &card.region)
                .map_err(Error::Text)?
                .map(Asset::Text)),
            CardType::Video(VideoCard { asset, looped: _ }) => {
                Ok(nodekit_rs_video::Video::new(asset, &card.region)
                    .map_err(Error::Video)?
                    .map(Asset::Video))
            }
            CardType::TextEntry(text_entry) => {
                match self.text_engine.render_text_entry(text_entry, &card.region) {
                    Ok(text_entry) => Ok(text_entry.map(Asset::TextEntry)),
                    Err(error) => Err(Error::Text(error)),
                }
            }
            CardType::Slider(_) => todo!("Slider not yet implemented."),
        }
    }

    fn cache_cards(&mut self, state: &State) -> Result<(), Error> {
        // Add assets, ordered by z_index.
        for (card_key, card) in state
            .cards
            .iter()
            .sorted_by(|(_, a), (_, b)| a.region.z_index.cmp(&b.region.z_index))
        {
            if let Some(asset) = self.get_asset(card)? {
                self.assets.insert(card_key, asset);
            }
        }
        Ok(())
    }

    fn cache_sensor(&mut self, state: &State) -> Result<(), Error> {
        match state.sensor.as_ref() {
            Some(sensor) => match sensor {
                // Cache a TextEntry asset.
                Sensor::TextEntry(card_key) => self.cache_text_entry(*card_key, state),
                // Cache overlays per hoverable card.
                Sensor::Hover(hover) => {
                    self.cache_hover_sensor(hover, false);
                    Ok(())
                }
                // Cache border overlays per selectable card.
                Sensor::Select(select) => {
                    self.cache_hover_sensor(&select.hover, true);
                    Ok(())
                }
                Sensor::Slider(_) => todo!("Slider asset caching not yet implemented."),
            },
            None => Ok(()),
        }
    }

    fn cache_text_entry(&mut self, card_key: CardKey, state: &State) -> Result<(), Error> {
        if let CardType::TextEntry(text_entry) = &state.cards[card_key].card_type
            && let Some(text_entry) = self
                .text_engine
                .render_text_entry(text_entry, &state.cards[card_key].region)
                .map_err(Error::Text)?
        {
            // Add the asset.
            self.assets.insert(card_key, Asset::TextEntry(text_entry));
        }
        Ok(())
    }

    fn cache_hover_sensor(&mut self, hover: &nodekit_rs_models::sensor::Hover, selectable: bool) {
        for card_key in hover.hoverables.values().flatten() {
            let card_key = *card_key;
            if let Some(rect) = &self.assets[card_key].rect() {
                self.sensor.insert_hoverable(card_key, *rect, selectable);
            }
        }
    }

    fn get_dirty(&self, state: &State) -> Vec<CardKey> {
        state
            .cards
            .iter()
            // Get each dirty card.
            .filter(|(_, card)| card.dirty)
            // Get every card the dirty cards overlap with.
            .flat_map(|(card_key, _)| {
                let mut overlaps = vec![card_key];
                overlaps.extend_from_slice(&self.overlaps[card_key]);
                overlaps
            })
            // Unique keys only.
            .unique()
            // Sort by rendering order.
            .sorted_by(|a, b| {
                state.cards[*a]
                    .region
                    .z_index
                    .cmp(&state.cards[*b].region.z_index)
            })
            .collect()
    }

    fn erase(&mut self, card_keys: &[CardKey]) {
        card_keys
            .iter()
            .filter_map(|card_key| self.assets[*card_key].rect())
            .for_each(|rect| self.board.erase(&rect));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use hashbrown::{HashMap, HashSet};
    use nodekit_rs_models::Region;
    use nodekit_rs_models::sensor::{Hover, Select};
    use slotmap::SlotMap;
    use std::path::PathBuf;

    #[test]
    fn test_render() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        cards.insert(image_card());
        cards.insert(video_card());
        cards.insert(text_card());

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "000.png");
        render_image(&mut renderer, &mut state, 100, "100.png");
        render_image(&mut renderer, &mut state, 200, "200.png");
        render_image(&mut renderer, &mut state, 600, "600.png");
    }

    #[test]
    fn test_no_cursor() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        cards.insert(image_card());
        cards.insert(video_card());
        cards.insert(text_card());

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "no_cursor.png");
    }

    #[test]
    fn test_sensor() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        let mut image = image_card();
        image.dirty = true;
        let image = cards.insert(image);
        let mut video = video_card();
        video.dirty = true;
        let video = cards.insert(video);
        let mut hoverables = HashMap::default();
        let a = "a".to_string();
        let b = "b".to_string();
        hoverables.insert(a.clone(), vec![image]);
        hoverables.insert(b.clone(), vec![video]);
        let sensor = Sensor::Select(Select {
            hover: Hover {
                hoverables,
                hovering: Some(a),
            },
            selected: HashSet::from([b]),
        });
        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, Some(sensor));
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "sensor.png");
    }

    fn image_card() -> Card {
        let image_path = PathBuf::from("../nodekit-rs-image/test_image.png");
        assert!(image_path.exists());
        Card {
            region: Region {
                x: -205,
                y: -205,
                w: 154,
                h: 154,
                z_index: Some(0),
            },
            card_type: CardType::Image(nodekit_rs_models::card::Asset::Path(image_path)),
            dirty: false,
        }
    }

    fn video_card() -> Card {
        let video_path = PathBuf::from("../nodekit-rs-video/test-video.mp4");
        Card {
            region: Region {
                x: 100,
                y: 50,
                w: 410,
                h: 614,
                z_index: Some(1),
            },
            card_type: CardType::Video(VideoCard {
                asset: nodekit_rs_models::card::Asset::Path(video_path),
                looped: false,
            }),
            dirty: false,
        }
    }

    fn text_card() -> Card {
        Card {
            region: Region {
                x: 0,
                y: 0,
                w: HORIZONTAL.i_64,
                h: VERTICAL.i_64,
                z_index: Some(5),
            },
            card_type: CardType::Text(nodekit_rs_models::card::TextCard {
                text: include_str!("../../nodekit-rs-text/lorem.txt").to_string(),
                font_size: 20,
                justification_horizontal: nodekit_rs_models::card::JustificationHorizontal::Left,
                justification_vertical: nodekit_rs_models::card::JustificationVertical::Center,
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
        let mut cards = SlotMap::default();
        cards.insert(image_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(text_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(image_card());
        cards.insert(text_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 2);
        for o in renderer.overlaps.values() {
            assert_eq!(o.len(), 1)
        }
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(video_card());
        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
        renderer.start(&state).unwrap();
        // Always re-blit a video.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));
        state.set_t_msec(1);
        assert!(state.cards.values().all(|card| card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(image_card());
        cards.insert(text_card());
        cards.insert(video_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, None);
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
