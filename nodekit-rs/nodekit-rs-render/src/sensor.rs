use crate::asset::Asset;
use nodekit_rs_models::SelectableCardKey;
use nodekit_rs_text::TextEntryBuffers;
use nodekit_rs_visual::RgbaBuffer;
use slotmap::{new_key_type, SecondaryMap, SlotMap};

new_key_type! { pub struct ConfirmAssetKey; }

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
        confirm: SlotMap<ConfirmAssetKey, Asset>,
    },
    TextEntry(Box<TextEntryBuffers>),
}
