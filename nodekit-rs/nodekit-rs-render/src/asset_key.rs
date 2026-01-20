use nodekit_rs_models::{MultiSelectCardKey, MultiSelectConfirmCardKey, SelectableCardKey};
use nodekit_rs_state::CardKey;

#[derive(Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub enum AssetKey {
    Card(CardKey),
    Hoverable(SelectableCardKey),
    Selectable(MultiSelectCardKey),
    MultiSelectConfirm(MultiSelectConfirmCardKey),
    TextEntry,
}
