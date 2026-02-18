use crate::card::{Card, CardKey};
use crate::sensor::error::ChoiceKeyError;
use hashbrown::{HashMap, HashSet};
use slotmap::{SecondaryMap, SlotMap};

/// Listen for mouse selection and hovering.
#[derive(Default)]
pub struct Select {
    /// Cards mapped to choices.
    cards: SecondaryMap<CardKey, String>,
    /// Listener for hovering.
    choices: HashMap<String, Vec<CardKey>>,
    /// A set of choice keys of selected groups of cards.
    selected: HashSet<String>,
}

impl Select {
    pub fn insert(&mut self, choice: String, cards: Vec<CardKey>) {
        self.choices.insert(choice.clone(), cards.clone());
        for card in cards {
            self.cards.insert(card, choice.clone());
        }
    }

    pub fn get_cards(&self) -> Vec<CardKey> {
        self.cards.keys().collect()
    }

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
                self.set_dirty_cards(&choice, cards)
            } else {
                Ok(())
            }
        } else {
            // Only update if something changed.
            if self.selected.remove(&choice) {
                self.set_dirty_cards(&choice, cards)
            } else {
                Ok(())
            }
        }
    }

    /// Returns true if the card mapped to `card_key` is selected.
    pub fn is_selected(&self, card_key: CardKey) -> bool {
        // Try to get the choice key mapped to the card.
        match self.cards.get(card_key) {
            Some(choice) => self.selected.contains(choice),
            None => false,
        }
    }

    /// Set all cards mapped to `choice` as dirty.
    fn set_dirty_cards(
        &self,
        choice: &str,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        match self.choices.get(choice) {
            Some(keys) => {
                keys.iter().for_each(|key| cards[*key].dirty = true);
                Ok(())
            }
            None => Err(ChoiceKeyError(choice.to_string())),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sensor::tests::get_card;
    use hashbrown::HashMap;

    #[test]
    fn test_select() {
        let mut cards = SlotMap::<CardKey, Card>::default();
        let a = cards.insert(get_card(0, 0));
        let b = cards.insert(get_card(100, 100));
        let c = cards.insert(get_card(-40, -40));

        let mut choices = HashMap::<String, Vec<CardKey>>::default();
        let choice_a = "a".to_string();
        let choice_b = "b".to_string();
        choices.insert(choice_a.clone(), vec![a]);
        choices.insert(choice_b.clone(), vec![b]);
        let mut cards_map = SecondaryMap::new();
        cards_map.insert(a, choice_a.clone());
        cards_map.insert(b, choice_b.clone());
        let mut select = Select {
            cards: cards_map,
            choices,
            selected: HashSet::new(),
        };

        // Select.
        select
            .select(choice_a.to_string(), true, &mut cards)
            .unwrap();
        assert!(select.selected.contains(&choice_a));
        assert!(cards[a].dirty);
        assert!(!cards[b].dirty);
        assert!(!cards[c].dirty);

        // Invalid.
        for s in [true, false] {
            assert!(select.select("c".to_string(), s, &mut cards).is_err());
            assert!(select.selected.contains(&choice_a));
            assert!(cards[a].dirty);
            assert!(!cards[b].dirty);
            assert!(!cards[c].dirty);
        }

        // Deselect and fail silently.
        select
            .select(choice_b.to_string(), false, &mut cards)
            .unwrap();
        assert!(select.selected.contains(&choice_a));
        assert!(cards[a].dirty);
        assert!(!cards[b].dirty);
        assert!(!cards[c].dirty);

        // Select.
        select
            .select(choice_b.to_string(), true, &mut cards)
            .unwrap();
        assert!(select.selected.contains(&choice_a));
        assert!(select.selected.contains(&choice_b));
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(!cards[c].dirty);

        // Deselect.
        select
            .select(choice_b.to_string(), false, &mut cards)
            .unwrap();
        assert!(select.selected.contains(&choice_a));
        assert!(!select.selected.contains(&choice_b));
        assert!(cards[b].dirty);
        assert!(!cards[c].dirty);
    }
}
