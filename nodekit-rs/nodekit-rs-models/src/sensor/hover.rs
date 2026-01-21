use crate::card::{Card, CardKey};
use crate::sensor::error::SensorError;
use hashbrown::HashMap;
use slotmap::SlotMap;

pub struct Hover {
    pub hoverable: HashMap<String, Vec<CardKey>>,
    pub hovering: Option<String>,
}

impl Hover {
    pub fn set(
        &mut self,
        hovering: Option<String>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), SensorError> {
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

    pub(super) fn set_dirty_cards(
        &self,
        choice: &str,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), SensorError> {
        // Mark the cards as dirty.
        for card_key in self
            .hoverable
            .get(choice)
            .ok_or(SensorError::ChildKey(choice.to_string()))?
        {
            cards[*card_key].dirty = true;
        }
        Ok(())
    }
}
