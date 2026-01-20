use crate::asset::Asset;
use nodekit_rs_models::SelectableCardKey;
use nodekit_rs_text::TextEntryBuffers;
use nodekit_rs_visual::RgbaBuffer;
use slotmap::SecondaryMap;

pub struct HoverableAsset {
    pub asset: Asset,
    pub overlay: RgbaBuffer,
}

pub struct SelectableAsset {
    pub hoverable: HoverableAsset,
    pub border: RgbaBuffer,
}

pub enum Sensor {
    Select(SecondaryMap<SelectableCardKey, HoverableAsset>),
    MultiSelect {
        choices: SecondaryMap<SelectableCardKey, SelectableAsset>,
        confirm: Vec<Asset>,
    },
    TextEntry(Box<TextEntryBuffers>),
}
