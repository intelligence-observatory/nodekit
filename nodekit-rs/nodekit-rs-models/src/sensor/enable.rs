use crate::card::{Card, CardKey};
use slotmap::{SecondaryMap, SlotMap, new_key_type};

new_key_type! { pub struct EnableKey; }

#[derive(Default)]
pub struct Enable {
    cards: SlotMap<EnableKey, Vec<CardKey>>,
    enabled: SecondaryMap<EnableKey, bool>,
}

impl Enable {
    pub fn insert(&mut self, cards: Vec<CardKey>) -> EnableKey {
        let k = self.cards.insert(cards);
        self.enabled.insert(k, false);
        k
    }

    pub fn enabled(&self, key: EnableKey) -> bool {
        self.enabled[key]
    }

    pub fn set(&mut self, key: EnableKey, enabled: bool, cards: &mut SlotMap<CardKey, Card>) {
        if self.enabled[key] != enabled {
            self.enabled[key] = enabled;
            self.cards[key].iter().for_each(|k| cards[*k].dirty = true);
        }
    }
}
