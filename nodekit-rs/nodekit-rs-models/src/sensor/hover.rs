use crate::card::{Card, CardKey};
use crate::sensor::error::ChoiceKeyError;
use hashbrown::HashMap;
use slotmap::SlotMap;

/// Listen for mouse hovering.
pub struct Hover {
    /// The cards that can receive hover overlays.
    /// Key: The choices key, from the raw nodekit model.
    /// Value: The keys to the flattened card value from the raw nodekit model.
    pub hoverables: HashMap<String, Vec<CardKey>>,
    /// The choice key of the card(s) that receive hovering overlays.
    pub hovering: Option<String>,
}

impl Hover {
    pub fn set(
        &mut self,
        hovering: Option<String>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        // Only update if something changed.
        if hovering != self.hovering {
            match (self.hovering.as_ref(), hovering) {
                (Some(old), Some(new)) => {
                    self.set_dirty_cards(old, cards)?;
                    self.set_dirty_cards(&new, cards)?;
                    self.hovering = Some(new);
                    Ok(())
                }
                (Some(old), None) => {
                    self.set_dirty_cards(old, cards)?;
                    self.hovering = None;
                    Ok(())
                }
                (None, Some(new)) => {
                    self.set_dirty_cards(&new, cards)?;
                    self.hovering = Some(new);
                    Ok(())
                }
                (None, None) => Ok(()),
            }
        } else {
            Ok(())
        }
    }

    pub fn get_hovering_over(&self) -> Option<&Vec<CardKey>> {
        self.hovering
            .as_ref()
            .map(|hovering| self.hoverables.get(hovering))
            .flatten()
    }

    pub(super) fn set_dirty_cards(
        &self,
        choice: &str,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        for card_key in self
            .hoverables
            .get(choice)
            .ok_or(ChoiceKeyError(choice.to_string()))?
        {
            cards[*card_key].dirty = true;
        }
        Ok(())
    }
}
