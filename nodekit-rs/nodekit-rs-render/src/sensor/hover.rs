use blittle::ClippedRect;
use blittle::overlay::Vec4;
use slotmap::SecondaryMap;
use nodekit_rs_models::card::CardKey;
use nodekit_rs_visual::RgbaBuffer;

const HOVERABLE_OVERLAY_COLOR: Vec4 = Vec4::new(0., 0., 0., 0.1);

#[derive(Default)]
pub struct Hover {
    overlays: SecondaryMap<CardKey, RgbaBuffer>
}

impl Hover {
    pub fn get(&self, card_key: CardKey) -> Option<&RgbaBuffer> {
        self.overlays.get(card_key)
    }

    pub fn insert(&mut self, card_key: CardKey, rect: ClippedRect) {
        let buffer = vec![HOVERABLE_OVERLAY_COLOR; rect.src_size.w * rect.src_size.h];
        self.overlays.insert(card_key, RgbaBuffer { buffer, rect });
    }
}