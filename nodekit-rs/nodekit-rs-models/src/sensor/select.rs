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
        let mut hoverables = HashMap::<String, Vec<CardKey>>::default();
        let choice_a = "a".to_string();
        let choice_b = "b".to_string();
        hoverables.insert(choice_a.clone(), vec![a]);
        hoverables.insert(choice_b.clone(), vec![b]);
        let hover = Hover {
            hoverables,
            hovering: None,
        };
        let mut select = Select {
            hover,
            selected: HashSet::default(),
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
