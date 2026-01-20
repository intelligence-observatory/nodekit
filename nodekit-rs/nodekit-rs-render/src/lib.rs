mod asset;
mod asset_key;
mod error;
mod hoverable;
mod overlap;
mod selectable;

use crate::asset::{AssetType, InteractiveAsset, NonInteractiveAsset};
use crate::asset_key::{AssetKey, Overlap, OverlapKey};
use crate::hoverable::Hoverable;
use crate::selectable::Selectable;
use asset::Asset;
use blittle::overlay::{Vec4, rgba8_to_rgba32_color};
use blittle::{ClippedRect, get_index};
pub use error::Error;
use itertools::Itertools;
use nodekit_rs_image::*;
use nodekit_rs_models::{
    Card, CardType, MultiSelectCardKey, SelectableCardKey, SensorType, board::*,
};
use nodekit_rs_state::*;
use nodekit_rs_text::TextEntryBuffers;
use nodekit_rs_visual::*;
use numpy::{PyArray3, PyArrayMethods, PyUntypedArrayMethods};
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use slotmap::SecondaryMap;
use std::collections::{HashMap, HashSet};
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

const HOVERABLE_OVERLAY_COLOR: Vec4 = Vec4::new(0., 0., 0., 0.1);
const SELECTABLE_COLOR_CHANNEL: f32 = 50. / 255.;
const SELECTABLE_BORDER_COLOR: Vec4 = Vec4::new(
    SELECTABLE_COLOR_CHANNEL,
    SELECTABLE_COLOR_CHANNEL,
    SELECTABLE_COLOR_CHANNEL,
    0.9,
);

/// Render a `State` while storing an internal cache of loaded data (fonts, video buffers, etc.)
#[pyclass]
#[gen_stub_pyclass]
#[derive(Default)]
pub struct Renderer {
    board: Board,
    /// Cached text engine.
    text_engine: nodekit_rs_text::TextEngine,
    /// Cached assets.
    assets: HashMap<AssetKey, Asset>,
    /// These assets need to be cleared and re-filled per frame.
    overlaps: HashMap<AssetKey, Vec<AssetKey>>,
    text_entry_key: Option<AssetKey>,
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
            let dirty_cards = self.get_dirty_cards(state);
            // Erase.
            self.erase(&dirty_cards);
            // Re-render dirty assets.
            for card_key in dirty_cards {
                // Render.
                render_asset!(self, &mut self.assets[card_key], state);
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

        // Initial blit.
        for asset in self.assets.values_mut() {
            render_asset!(self, asset, state);
        }

        Ok(())
    }

    fn fill_and_cache(&mut self, state: &State) -> Result<(), Error> {
        // Clear the asset caches.
        self.assets.clear();
        self.text_entry_key = None;
        // Cache assets.
        self.cache_cards(state)?;
        self.cache_sensor(state)?;

        // Set overlaps.
        let mut rects = self
            .assets
            .iter()
            .filter_map(|(k, _)| self.assets[k].asset.rect().map(|rect| (k, rect)))
            .collect::<HashMap<AssetKey, ClippedRect>>();
        self.overlaps = rects
            .iter()
            .map(|(k_a, rect_a)| {
                (
                    *k_a,
                    rects
                        .iter()
                        .filter_map(|(k_b, rect_b)| {
                            if k_a != k_b && rect_a.overlaps(rect_b) {
                                Some(*k_b)
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

    fn get_non_interactive_asset(
        &mut self,
        card: &Card,
    ) -> Result<Option<NonInteractiveAsset>, Error> {
        match &card.card_type {
            CardType::Image(image) => Ok(load_image(image, &card.region)
                .map_err(Error::Image)?
                .map(NonInteractiveAsset::Image)),
            CardType::Text(text_card) => Ok(self
                .text_engine
                .render_text_card(text_card, &card.region)
                .map_err(Error::Text)?
                .map(NonInteractiveAsset::Text)),
            CardType::Video { asset, looped: _ } => {
                Ok(nodekit_rs_video::Video::new(asset, &card.region)
                    .map_err(Error::Video)?
                    .map(NonInteractiveAsset::Video))
            }
        }
    }

    fn cache_cards(&mut self, state: &State) -> Result<(), Error> {
        for (card_key, card) in state.cards.iter() {
            if let Some(asset) = self.get_non_interactive_asset(card)? {
                self.assets.insert(
                    AssetKey::Card(card_key),
                    Asset {
                        asset: AssetType::NonInteractive(asset),
                        z_index: card.region.z_index,
                    },
                );
            }
        }
        Ok(())
    }

    fn cache_sensor(&mut self, state: &State) -> Result<(), Error> {
        if let Some(sensor) = state.sensor.as_ref() {
            match &sensor.sensor_type {
                SensorType::TextEntry(text_entry) => {
                    if let Some(buffers) = self
                        .text_engine
                        .render_text_entry(text_entry)
                        .map_err(Error::Text)?
                    {
                        let k = AssetKey::TextEntry;
                        self.assets.insert(
                            k,
                            Asset {
                                asset: AssetType::Interactive(InteractiveAsset::TextEntry(buffers)),
                                z_index: text_entry.region.z_index,
                            },
                        );
                        self.text_entry_key = Some(k);
                    }
                }
                SensorType::Select { cards, hovering: _ } => {
                    for (k, card) in cards {
                        if let Some(asset) = self.get_non_interactive_asset(card)?
                            && let Some(asset) = Hoverable::new(asset)
                        {
                            self.assets.insert(
                                AssetKey::Hoverable(k),
                                Asset {
                                    asset: AssetType::Interactive(InteractiveAsset::Hoverable(
                                        asset,
                                    )),
                                    z_index: card.region.z_index,
                                },
                            );
                        }
                    }
                }
                SensorType::MultiSelect {
                    cards,
                    hovering: _,
                    selected: _,
                    confirm,
                } => {
                    for (k, card) in cards {
                        if let Some(asset) = self.get_non_interactive_asset(&card.card)?
                            && let Some(asset) = Selectable::new(asset)
                        {
                            self.assets.insert(
                                AssetKey::Selectable(k),
                                Asset {
                                    asset: AssetType::Interactive(InteractiveAsset::Selectable(
                                        asset,
                                    )),
                                    z_index: card.card.region.z_index,
                                },
                            );
                        }
                    }
                    for (k, card) in confirm.iter() {
                        if let Some(asset) = self.get_non_interactive_asset(card)? {
                            self.assets.insert(
                                AssetKey::MultiSelectConfirm(k),
                                Asset {
                                    asset: AssetType::MultiSelectConfirm(asset),
                                    z_index: card.region.z_index,
                                },
                            );
                        }
                    }
                }
                SensorType::Slider {
                    num_bins: _,
                    bin: _,
                    show_bin_markers: _,
                    orientation: _,
                    region: _,
                } => todo!(),
            }
        }
        Ok(())
    }

    fn hoverable_overlay(rect: ClippedRect) -> RgbaBuffer {
        let buffer = vec![HOVERABLE_OVERLAY_COLOR; rect.src_size.w * rect.src_size.h];
        RgbaBuffer { buffer, rect }
    }

    fn get_dirty(&self, state: &State) -> Vec<AssetKey> {
        let mut dirty = HashSet::default();
        // Get dirty cards.
        dirty.extend(
            state
                .cards
                .iter()
                .filter(|(_, v)| v.dirty)
                .flat_map(|(k, _)| {
                    let k = AssetKey::Card(k);
                    let mut overlaps = vec![k];
                    overlaps.extend_from_slice(&self.overlaps[&k]);
                    overlaps
                }),
        );
        // Get dirty sensors.
        if let Some(sensor) = state.sensor.as_ref()
            && sensor.dirty
        {
            match &sensor.sensor_type {
                SensorType::Slider {
                    num_bins: _,
                    bin: _,
                    show_bin_markers: _,
                    orientation: _,
                    region: _,
                } => todo!(),
                SensorType::MultiSelect {
                    cards: _,
                    hovering,
                    selected,
                    confirm: _,
                } => {
                    if let Some(hovering) = hovering {
                        let k = AssetKey::Selectable(*hovering);
                        dirty.push(k);
                        dirty.extend_from_slice(&self.overlaps[&k]);
                    }
                    for selected in selected.keys() {
                        let k = AssetKey::Selectable(selected);
                        dirty.push(k);
                        dirty.extend_from_slice(&self.overlaps[&k]);
                    }
                }
                SensorType::Select { cards: _, hovering } => {
                    if let Some(hovering) = hovering {
                        let k = AssetKey::Selectable(*hovering);
                        dirty.push(k);
                        dirty.extend_from_slice(&self.overlaps[&k]);
                    }
                }
                SensorType::TextEntry(text_entry ) => {
                    if let Some(k) = self.text_entry_key {
                        let k = AssetKey::Selectable(k);
                        dirty.push(k);
                        dirty.extend_from_slice(&self.overlaps[&k]);
                    }
                }
            }
        }
        // Set rendering order.
        dirty.sort_by(|a, b| self.assets[a].z_index.cmp(&self.assets[b].z_index));
        dirty.into()
    }

    fn erase(&mut self, card_keys: &[CardKey]) {
        card_keys
            .iter()
            .filter_map(|card_key| match &self.assets[*card_key] {
                Asset::Image(buffer) => Some(buffer.rect()),
                Asset::Text(text_buffers) => text_buffers.rect(),
                Asset::Video(video) => Some(video.rgb_buffer.rect),
                Asset::TextEntry(text_buffers) => Some(text_buffers.rect),
            })
            .for_each(|rect| self.board.erase(&rect));
    }
}

#[cfg(test)]
mod tests {
    use crate::Renderer;
    use nodekit_rs_models::board::*;
    use nodekit_rs_models::*;
    use nodekit_rs_state::{CardKey, State};
    use std::path::PathBuf;

    #[test]
    fn test_render() {
        let cards = vec![image_card(), video_card(), text_card()];

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "000.png");
        render_image(&mut renderer, &mut state, 100, "100.png");
        render_image(&mut renderer, &mut state, 200, "200.png");
        render_image(&mut renderer, &mut state, 600, "600.png");
    }

    #[test]
    fn test_no_cursor() {
        let cards = vec![image_card(), video_card(), text_card()];

        let mut state = State::new_inner("#AAAAAAFF".to_string(), cards);
        let mut renderer = Renderer::default();
        render_image(&mut renderer, &mut state, 0, "no_cursor.png");
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
            card_type: CardType::Image(Asset::Path(image_path)),
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
                x: 0,
                y: 0,
                w: HORIZONTAL.i_64,
                h: VERTICAL.i_64,
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

    fn render_image(renderer: &mut Renderer, state: &mut State, t_msec: u64, filename: &str) {
        state.t_msec = t_msec;
        renderer.start(&state).unwrap();
        nodekit_rs_png::board_to_png(filename, renderer.blit(state).unwrap());
    }

    #[test]
    fn test_dirty_rects() {
        let mut renderer = Renderer::new();
        let state = State::new_inner("#AAAAAAFF".to_string(), vec![image_card()]);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));
        let state = State::new_inner("#AAAAAAFF".to_string(), vec![text_card()]);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));

        let state = State::new_inner("#AAAAAAFF".to_string(), vec![image_card(), text_card()]);
        renderer.start(&state).unwrap();
        // No need to re-blit.
        assert_eq!(renderer.overlaps.len(), 2);
        for o in renderer.overlaps.values() {
            assert_eq!(o.len(), 1)
        }
        assert!(state.cards.values().all(|card| !card.dirty));

        let mut state = State::new_inner("#AAAAAAFF".to_string(), vec![video_card()]);
        renderer.start(&state).unwrap();
        // Always re-blit a video.
        assert_eq!(renderer.overlaps.len(), 1);
        assert!(renderer.overlaps.values().all(|v| v.is_empty()));
        assert!(state.cards.values().all(|card| !card.dirty));
        state.set_t_msec(1);
        assert!(state.cards.values().all(|card| card.dirty));

        let state = State::new_inner(
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
