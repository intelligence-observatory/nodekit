use crate::Card;
use slotmap::new_key_type;

pub struct MultiSelectCard {
    /// The ID of the choice.
    pub choice: String,
    pub card: Card,
}
