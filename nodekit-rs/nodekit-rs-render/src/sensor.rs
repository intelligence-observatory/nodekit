use crate::asset::Asset;
use blittle::ClippedRect;
use blittle::overlay::Vec4;
use nodekit_rs_models::card::CardKey;
use nodekit_rs_visual::{RgbaBuffer, VisualBuffer};
use slotmap::SecondaryMap;

const HOVERABLE_OVERLAY_COLOR: Vec4 = Vec4::new(0., 0., 0., 0.1);
const C: f32 = 50. / 255.;
const SELECTABLE_BORDER_COLOR: Vec4 = Vec4::new(C, C, C, 0.9);

/// Sensor-related bitmaps.
#[derive(Default)]
pub struct Sensor {
    /// Overlays used for hovering.
    hover_overlays: SecondaryMap<CardKey, RgbaBuffer>,
    /// Overlays used for selections.
    select_borders: SecondaryMap<CardKey, RgbaBuffer>,
    /// Show this instead of the original buffer if the card is disabled.
    disabled: SecondaryMap<CardKey, Vec<RgbaBuffer>>,
}

impl Sensor {
    /// Add a hoverable overlay mapped to `card_key` with shape `rect`.
    /// If `selectable`, add a selection borders overlay too.
    pub fn insert_hoverable(&mut self, card_key: CardKey, rect: ClippedRect) {
        let buffer = vec![HOVERABLE_OVERLAY_COLOR; rect.src_size.w * rect.src_size.h];
        self.hover_overlays
            .insert(card_key, RgbaBuffer { buffer, rect });
    }

    /// Add a selection borders overlay mapped to `card_key` with shape `rect`.
    pub fn insert_selectable(&mut self, card_key: CardKey, rect: ClippedRect) {
        self.select_borders
            .insert(card_key, Self::selectable_border(rect));
    }

    pub fn insert_disabled(
        &mut self,
        card_key: CardKey,
        assets: &mut SecondaryMap<CardKey, Asset>,
    ) {
        if let Some(asset) = assets.get_mut(card_key) {
            // Clone and/or convert the asset's buffers.
            let mut buffers = match asset {
                Asset::Image(image) => match image {
                    VisualBuffer::Rgb(rgb) => vec![rgb.as_rgba()],
                    VisualBuffer::Rgba(rgba) => vec![rgba.clone()],
                },
                Asset::Slider(slider) => slider.get_clones_of_overlays(),
                Asset::Text(text) => text.get_clones_of_overlays(),
                Asset::TextEntry(text_entry) => text_entry.get_clones_of_overlays(),
                Asset::Video(video) => vec![video.rgb_buffer.as_rgba()],
            };
            // Drop the opacity.
            buffers
                .iter_mut()
                .for_each(|buffer| buffer.buffer.iter_mut().for_each(|pixel| pixel.w *= 0.1));
            // Add the buffers.
            self.disabled.insert(card_key, buffers);
        }
    }

    pub fn get_hover_overlay(&self, card_key: CardKey) -> Option<&RgbaBuffer> {
        self.hover_overlays.get(card_key)
    }

    pub fn get_select_border(&self, card_key: CardKey) -> Option<&RgbaBuffer> {
        self.select_borders.get(card_key)
    }

    pub fn get_disabled(&self, card_key: CardKey) -> Option<&Vec<RgbaBuffer>> {
        self.disabled.get(card_key)
    }

    pub fn clear(&mut self) {
        self.hover_overlays.clear();
        self.select_borders.clear();
    }

    fn selectable_border(rect: ClippedRect) -> RgbaBuffer {
        // An empty buffer.
        let mut buffer = vec![Vec4::ZERO; rect.src_size.w * rect.src_size.h];
        // Horizontal.
        let horizontal = vec![SELECTABLE_BORDER_COLOR; rect.src_size.w];
        // Lines are 2 pixels thick.
        for y in [0, 1, rect.src_size.h - 2, rect.src_size.h - 1] {
            let index = y * rect.src_size.w;
            buffer[index..index + rect.src_size.w].copy_from_slice(&horizontal);
        }
        // Vertical.
        let xs = [0, 1, rect.src_size.w - 2, rect.src_size.h - 1];
        for y in 2..rect.src_size.h - 2 {
            for x in xs {
                let index = x + y * rect.src_size.w;
                buffer[index] = SELECTABLE_BORDER_COLOR;
            }
        }
        RgbaBuffer { buffer, rect }
    }
}
