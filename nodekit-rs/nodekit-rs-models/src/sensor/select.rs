use super::hover::Hover;
use crate::card::{Card, CardKey};
use crate::sensor::error::ChoiceKeyError;
use hashbrown::HashSet;
use slotmap::SlotMap;

/// Listen for mouse selection and hovering.
pub struct Select {
    /// Listener for hovering.
    pub hover: Hover,
    /// A set of choice keys of selected groups of cards.
    pub selected: HashSet<String>,
}

impl Select {
    /// Select the card(s) mapped to `choice`.
    /// Returns an error if `choice` is an invalid key.
    pub fn select(
        &mut self,
        choice: String,
        select: bool,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        if select {
            // Only update if something changed.
            if self.selected.insert(choice.clone()) {
                self.hover.set_dirty_cards(&choice, cards)
            } else {
                Ok(())
            }
        } else {
            // Only update if something changed.
            if self.selected.remove(&choice) {
                self.hover.set_dirty_cards(&choice, cards)
            } else {
                Ok(())
            }
        }
    }

    pub fn get_selected(&self) -> Vec<CardKey> {
        self.selected
            .iter()
            .flat_map(|s| self.hover.hoverables.get(s))
            .flatten()
            .map(|c| *c)
            .collect()
    }
}
