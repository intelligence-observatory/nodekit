use super::hover::Hover;
use hashbrown::HashSet;
use slotmap::SlotMap;
use crate::card::{Card, CardKey};
use crate::sensor::error::SensorError;

pub struct Select {
    pub hover: Hover,
    pub selected: HashSet<String>,
}

impl Select {
    pub fn select(&mut self, selection: String, select: bool, cards: &mut SlotMap<CardKey, Card>) -> Result<(), SensorError> {
        if select {
            // Only update if something changed.
            if self.selected.insert(selection.clone()) {
                self.hover.set_dirty_cards(&selection, cards)
            }
            else {
                Ok(())
            }
        }
        else {
            // Only update if something changed.
            if self.selected.remove(&selection) {
                self.hover.set_dirty_cards(&selection, cards)
            }
            else {
                Ok(())
            }
        }
    }
}