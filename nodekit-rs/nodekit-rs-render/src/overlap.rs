use blittle::ClippedRect;
use nodekit_rs_models::SelectableCardKey;
use nodekit_rs_state::CardKey;
use crate::sensor::ConfirmAssetKey;

#[derive(Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub enum OverlapKey {
    Card(CardKey),
    Selectable(SelectableCardKey),
    Confirm(ConfirmAssetKey),
    TextEntry
}

pub struct Overlap {
    pub rect: ClippedRect,
    pub z_index: Option<i64>
}