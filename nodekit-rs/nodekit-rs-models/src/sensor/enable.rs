use crate::card::{Card, CardKey};
use slotmap::{SecondaryMap, SlotMap, new_key_type};

new_key_type! { pub struct EnableKey; }

/// A group of cards, and whether they are enabled.
pub struct EnabledCards {
    pub cards: Vec<CardKey>,
    pub enabled: bool,
}

impl EnabledCards {
    pub const fn new(cards: Vec<CardKey>) -> Self {
        Self {
            cards,
            enabled: false,
        }
    }
}

#[derive(Default)]
pub struct Enable {
    enabled: SlotMap<EnableKey, EnabledCards>,
    cards: SecondaryMap<CardKey, EnableKey>,
}

impl Enable {
    pub fn insert(&mut self, cards: Vec<CardKey>) -> EnableKey {
        let enable = self.enabled.insert(EnabledCards::new(cards.clone()));
        for card in cards {
            self.cards.insert(card, enable);
        }
        enable
    }

    pub fn is_enabled(&self, card_key: CardKey) -> bool {
        match self.cards.get(card_key) {
            Some(enabled) => self.enabled[*enabled].enabled,
            None => false,
        }
    }

    pub fn set(&mut self, key: EnableKey, enabled: bool, cards: &mut SlotMap<CardKey, Card>) {
        if self.enabled[key].enabled != enabled {
            self.enabled[key].enabled = enabled;
            self.enabled[key]
                .cards
                .iter()
                .for_each(|k| cards[*k].dirty = true);
        }
    }

    pub fn get_cards(&self) -> Vec<CardKey> {
        self.cards.keys().collect()
    }
}
