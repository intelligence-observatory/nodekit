use nodekit_rs_models::MultiSelectConfirmCardKey;
use nodekit_rs_state::CardKey;

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub enum AssetKey {
    Card(CardKey),
    Hoverable(String),
    Selectable(String),
    MultiSelectConfirm(MultiSelectConfirmCardKey),
    TextEntry,
}
