use blittle::ClippedRect;
use blittle::overlay::Vec4;
use nodekit_rs_models::card::CardKey;
use nodekit_rs_visual::RgbaBuffer;
use slotmap::SecondaryMap;

const HOVERABLE_OVERLAY_COLOR: Vec4 = Vec4::new(0., 0., 0., 0.1);
const C: f32 = 50. / 255.;
const SELECTABLE_BORDER_COLOR: Vec4 = Vec4::new(C, C, C, 0.9);

#[derive(Default)]
pub struct Selectables {
    hover_overlays: SecondaryMap<CardKey, RgbaBuffer>,
    select_borders: SecondaryMap<CardKey, RgbaBuffer>,
}

impl Selectables {
    pub fn insert(&mut self, card_key: CardKey, rect: ClippedRect, selectable: bool) {
        let buffer = vec![HOVERABLE_OVERLAY_COLOR; rect.src_size.w * rect.src_size.h];
        self.hover_overlays
            .insert(card_key, RgbaBuffer { buffer, rect });
        if selectable {
            self.select_borders
                .insert(card_key, Self::selectable_border(rect));
        }
    }

    pub fn get_hover_overlay(&self, card_key: CardKey) -> Option<&RgbaBuffer> {
        self.hover_overlays.get(card_key)
    }

    pub fn get_select_border(&self, card_key: CardKey) -> Option<&RgbaBuffer> {
        self.select_borders.get(card_key)
    }

    pub fn clear(&mut self) {
        self.hover_overlays.clear();
        self.select_borders.clear();
    }

    fn selectable_border(rect: ClippedRect) -> RgbaBuffer {
        let mut buffer = vec![Vec4::ZERO; rect.src_size.w * rect.src_size.h];
        // Horizontal.
        let horizontal = vec![SELECTABLE_BORDER_COLOR; rect.src_size.w];
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
