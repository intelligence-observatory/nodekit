mod asset;
mod error;
mod sensor;

use asset::Asset;
use blittle::ClippedRect;
pub use error::Error;
use itertools::Itertools;
use nodekit_rs_image::*;
use nodekit_rs_models::board::{HORIZONTAL, STRIDE, VERTICAL};
use nodekit_rs_models::card::{CardKey, CardType, VideoCard};
use nodekit_rs_state::*;
use nodekit_rs_visual::*;
use numpy::{PyArray3, PyArrayMethods, PyUntypedArrayMethods};
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SecondaryMap;
use std::ops::DerefMut;
use uuid::Uuid;

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
        self.board.hide_pointer = !visible;
    }
}

impl Renderer {
    fn blit(&mut self, state: &mut State) -> Result<&[u8], Error> {
        if self.id.is_none_or(|id| id != state.id) {
            // New state.
            self.start(state)?;
        } else {
            // Get dirty cards.
            let dirty_cards = self.get_dirty(state);
            // Erase regions defined by dirty cards.
            self.erase(&dirty_cards);
            // Re-render dirty assets.
            for card_key in dirty_cards {
                // Update sensors.
                match (&state.cards[card_key].card_type, &mut self.assets[card_key]) {
                    (CardType::TextEntry(card), Asset::TextEntry(asset)) => {
                        // Set text entry text.
                        if let Some(text_entry) = self
                            .text_engine
                            .render_text_entry(card, &state.cards[card_key].region)
                            .map_err(Error::Text)?
                        {
                            *asset = text_entry;
                        }
                    }
                    (CardType::Slider(card), Asset::Slider(asset)) => {
                        // Update the slider state from the card.
                        asset.update(card);
                    }
                    _ => (),
                }

                // Render.
                self.render_asset(card_key, state)?;

                // Mark as not dirty.
                state.cards[card_key].dirty = false;
            }
        }

        if !self.board.hide_pointer {
            self.board.set_pointer(state.pointer.x, state.pointer.y);
        }

        Ok(self.board.render())
    }

    /// Start a new state.
    fn start(&mut self, state: &State) -> Result<(), Error> {
        match self.id.as_mut() {
            Some(id) => {
                if *id == state.id {
                    // Clear the board. Keep cached assets.
                    self.board.clear();
                } else {
                    // Clear the board and re-cache.
                    *id = state.id;
                    self.cache(state)?;
                }
            }
            None => {
                // Start the first run and cache.
                self.id = Some(state.id);
                self.cache(state)?;
            }
        }

        // Initial blit.
        let card_keys = self.assets.keys().collect::<Vec<CardKey>>();
        for card_key in card_keys {
            self.render_asset(card_key, state)?;
        }

        Ok(())
    }

    /// Fill the board with the background color and cache assets.
    fn cache(&mut self, state: &State) -> Result<(), Error> {
        // Fill the board.
        self.board
            .fill(parse_color_rgb(&state.board_color).map_err(Error::ParseColor)?);

        // Clear the asset caches.
        self.assets.clear();
        self.sensor.clear();
        // Cache assets.
        self.cache_cards(state)?;
        self.cache_sensor(state);

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
        Ok(())
    }

    fn cache_cards(&mut self, state: &State) -> Result<(), Error> {
        // Add assets, ordered by z_index.
        for (card_key, card) in state
            .cards
            .iter()
            .sorted_by(|(_, a), (_, b)| a.region.z_index.cmp(&b.region.z_index))
        {
            // Try to load the asset.
            // Assets are None if their rects are beyond the board area.
            let asset = match &card.card_type {
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
                CardType::Slider(slider) => {
                    match nodekit_rs_slider::Slider::new(&card.region, slider) {
                        Ok(slider) => Ok(slider.map(Asset::Slider)),
                        Err(error) => Err(Error::Slider(error)),
                    }
                }
            }?;
            if let Some(asset) = asset {
                self.assets.insert(card_key, asset);
            }
        }
        Ok(())
    }

    /// Cache the state's sensor.
    fn cache_sensor(&mut self, state: &State) {
        // Create hover overlays.
        if let Some(hover) = state.sensor.hover.as_ref() {
            for card_key in hover.get_cards() {
                if let Some(rect) = &self.assets[card_key].rect() {
                    self.sensor.insert_hoverable(card_key, *rect);
                }
            }
        }
        // Create select borders.
        if let Some(select) = state.sensor.select.as_ref() {
            for card_key in select.get_cards() {
                if let Some(rect) = &self.assets[card_key].rect() {
                    self.sensor.insert_selectable(card_key, *rect);
                }
            }
        }
        // Create disabled bitmaps.
        if let Some(enable) = state.sensor.enable.as_ref() {
            for card_key in enable.get_all_cards() {
                self.sensor.insert_disabled(card_key, &mut self.assets);
            }
        }
    }

    /// Returns all dirty cards.
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

    /// Render an asset mapped to `card_key`.
    fn render_asset(&mut self, card_key: CardKey, state: &State) -> Result<(), Error> {
        if let Some(asset) = self.assets.get_mut(card_key) {
            // If the asset is disabled, render its disabled bitmap instead.
            if !state.is_enabled(card_key)
                && let Some(disabled) = self.sensor.get_disabled(card_key)
            {
                // Render the card in its disabled state.
                for d in disabled.iter() {
                    self.board.overlay_rgba(d);
                }
            } else {
                match asset {
                    Asset::Image(image) => self.board.blit(image),
                    Asset::Slider(slider) => slider.blit(&mut self.board),
                    Asset::Text(text) => text.blit(&mut self.board),
                    Asset::TextEntry(text) => text.blit(&mut self.board),
                    Asset::Video(video) => {
                        video.get_frame(state.t_msec).map_err(Error::Video)?;
                        self.board.blit_rgb(&video.frame);
                    }
                }
                // Apply the hovering overlay.
                if state.is_hovering(card_key)
                    && let Some(overlay) = self.sensor.get_hover_overlay(card_key)
                {
                    self.board.overlay_rgba(overlay);
                }

                // Apply the selection border.
                if state.is_selected(card_key)
                    && let Some(overlay) = self.sensor.get_select_border(card_key)
                {
                    self.board.overlay_rgba(overlay);
                }
            }
        }
        Ok(())
    }

    /// For each rect associated with a key in `card_keys`,
    /// fill that region of the board with the background color.
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
    use nodekit_rs_models::Region;
    use nodekit_rs_models::card::{
        Card, JustificationHorizontal, JustificationVertical, SliderOrientation, TextCard,
    };
    use nodekit_rs_models::sensor::{Enable, GraphicalSensor, Hover, Select, Sensor};
    use slotmap::SlotMap;
    use std::path::PathBuf;

    #[test]
    fn test_render() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        cards.insert(image_card());
        cards.insert(video_card());
        cards.insert(text_card());

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "000.png");
        render_image(&mut renderer, &mut state, 100, "100.png");
        render_image(&mut renderer, &mut state, 200, "200.png");
        render_image(&mut renderer, &mut state, 600, "600.png");
    }

    #[test]
    fn test_no_pointer() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        cards.insert(image_card());
        cards.insert(video_card());
        cards.insert(text_card());

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
        let mut renderer = Renderer::default();
        renderer.board.hide_pointer = true;
        render_image(&mut renderer, &mut state, 0, "no_pointer.png");
    }

    #[test]
    fn test_select_render() {
        let mut cards = SlotMap::<CardKey, Card>::default();
        let mut image = image_card();
        image.dirty = true;
        let image = cards.insert(image);
        let mut video = video_card();
        video.dirty = true;
        let video = cards.insert(video);
        let confirm = cards.insert(confirm_button());
        let a = "a".to_string();
        let b = "b".to_string();

        let mut sensor = Sensor::default();

        let mut enable = Enable::default();
        let enable_key = enable.insert(vec![confirm]);
        sensor.enable = Some(enable);

        let mut select = Select::new(enable_key);
        select.insert(a.clone(), vec![image]);
        select.insert(b.clone(), vec![video]);
        sensor.select = Some(select);
        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, sensor);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "select.png");
    }

    #[test]
    fn test_slider_render() {
        let mut cards = SlotMap::with_capacity_and_key(3);
        let confirm = cards.insert(confirm_button());
        let slider = cards.insert(Card {
            region: Region {
                x: 0,
                y: 100,
                w: 500,
                h: 100,
                z_index: None,
            },
            card_type: CardType::Slider(nodekit_rs_models::card::Slider {
                orientation: SliderOrientation::Horizontal,
                num_bins: 6,
                bin: 3,
                show_bin_markers: true,
                committed: false,
            }),
            dirty: true,
        });
        let mut sensor = Sensor::default();
        let mut enable = Enable::default();
        let e = enable.insert(vec![confirm]);
        sensor.enable = Some(enable);
        sensor.graphical = Some(GraphicalSensor::Slider {
            card: slider,
            confirm_button: Some(e),
        });
        let mut hover = Hover::default();
        hover.insert(None, vec![confirm]);
        sensor.hover = Some(hover);

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, sensor);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "slider_0.png");

        // Enable the confirm button.
        state.set_slider_inner(3, true).unwrap();
        state.set_confirm_button_inner(true, false).unwrap();
        render_image(&mut renderer, &mut state, 0, "slider_1.png");

        // Set the hover.
        state.set_confirm_button_inner(true, true).unwrap();
        state.set_pointer(-30, -400);
        render_image(&mut renderer, &mut state, 0, "slider_2.png");
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
                w: HORIZONTAL.u_size.cast_signed() as i64,
                h: VERTICAL.u_size.cast_signed() as i64,
                z_index: Some(5),
            },
            card_type: CardType::Text(TextCard {
                text: include_str!("../../nodekit-rs-text/lorem.txt").to_string(),
                font_size: 20,
                justification_horizontal: JustificationHorizontal::Left,
                justification_vertical: JustificationVertical::Center,
                text_color: "#003300FF".to_string(),
                background_color: "#EE00EE11".to_string(),
            }),
            dirty: false,
        }
    }

    fn confirm_button() -> Card {
        Card {
            region: Region {
                x: 0,
                y: -300,
                w: 150,
                h: 90,
                z_index: Some(0),
            },
            card_type: CardType::Text(TextCard {
                text: "Confirm".to_string(),
                font_size: 20,
                justification_horizontal: JustificationHorizontal::Center,
                justification_vertical: JustificationVertical::Center,
                text_color: "#DDDDDDFF".to_string(),
                background_color: "#12121299".to_string(),
            }),
            dirty: true,
        }
    }

    fn render_image(renderer: &mut Renderer, state: &mut State, t_msec: u64, filename: &str) {
        renderer.board.clear();
        state.t_msec = t_msec;
        renderer.start(&state).unwrap();
        nodekit_rs_png::board_to_png(filename, renderer.blit(state).unwrap());
    }

    #[test]
    fn test_dirty_rects() {
        let mut renderer = Renderer::new();
        let mut cards = SlotMap::default();
        cards.insert(image_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(text_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(image_card());
        cards.insert(text_card());
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 2);
        for o in renderer.overlaps.values() {
            assert_eq!(o.len(), 1)
        }
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut cards = SlotMap::default();
        cards.insert(video_card());
        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
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
        let state = State::new_inner("#AAAAAAFF".to_string(), cards, Sensor::default());
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
