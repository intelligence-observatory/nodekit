use crate::card::{Card, CardKey};
use crate::sensor::error::{CardKeyError, ChoiceKeyError};
use hashbrown::HashMap;
use slotmap::{SecondaryMap, SlotMap, new_key_type};

new_key_type! { pub struct HoverKey; }

/// Listen for mouse hovering.
#[derive(Default)]
pub struct Hover {
    hovers: SlotMap<HoverKey, Vec<CardKey>>,
    /// String IDs from raw model data.
    choices: HashMap<String, HoverKey>,
    /// The key of the card(s) that receive hovering overlays.
    hovering: Option<HoverKey>,
    /// A mapping of cards back to hovers.
    cards: SecondaryMap<CardKey, HoverKey>,
}

impl Hover {
    /// Insert a new `choice` with associated `cards`.
    ///
    /// If `choice` is None, the cards aren't mapped to a string. This is how confirm buttons work.
    pub fn insert(&mut self, choice: Option<String>, cards: Vec<CardKey>) -> HoverKey {
        // Mark these cards as hoverable.
        let hover_key = self.hovers.insert(cards.clone());
        // Map them to a choice.
        if let Some(choice) = choice {
            self.choices.insert(choice, hover_key);
        }
        // Reverse-map the cards
        for card_key in cards {
            self.cards.insert(card_key, hover_key);
        }
        hover_key
    }

    /// Set the hover state.
    ///
    /// If `choice` is None, nothing is hovered.
    pub fn set_from_choice(
        &mut self,
        choice: Option<String>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        // Stop hovering.
        if let Some(hovering) = self.hovering {
            self.hovers[hovering]
                .iter()
                .for_each(|k| cards[*k].dirty = true);
        }

        match choice.as_ref() {
            Some(choice) => match self.choices.get(choice) {
                Some(key) => {
                    // Hover.
                    self.hovers[*key]
                        .iter()
                        .for_each(|k| cards[*k].dirty = true);
                    self.hovering = Some(*key);
                    Ok(())
                }
                None => Err(ChoiceKeyError(choice.clone())),
            },
            None => {
                self.hovering = None;
                Ok(())
            }
        }
    }

    /// Given a card key, find an associated hover key and set all associated cards as hovering.
    ///
    /// If `card_key` is None, nothing is hovered.
    pub fn set_from_card_key(
        &mut self,
        card_key: Option<CardKey>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), CardKeyError> {
        let hover_key = match card_key {
            Some(card_key) => Some(*self.cards.get(card_key).ok_or(CardKeyError(card_key))?),
            None => None,
        };

        // Stop hovering.
        if let Some(h) = self.hovering {
            self.hovers[h].iter().for_each(|k| cards[*k].dirty = true);
        }

        match hover_key {
            Some(hover_key) => {
                // Hover.
                self.hovers[hover_key]
                    .iter()
                    .for_each(|k| cards[*k].dirty = true);
                self.hovering = Some(hover_key);
            }
            None => {
                self.hovering = None;
            }
        }
        Ok(())
    }

    pub fn get_cards(&self) -> Vec<CardKey> {
        self.cards.keys().collect()
    }

    pub fn is_hovering(&self, card_key: CardKey) -> bool {
        match self.cards.get(card_key) {
            Some(hover_key) => match self.hovering {
                Some(hovering) => *hover_key == hovering,
                None => false,
            },
            None => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::card::*;
    use crate::sensor::tests::get_card;

    #[test]
    fn test_hover() {
        // Define the cards.
        let mut cards = SlotMap::<CardKey, Card>::default();
        let a = cards.insert(get_card(0, 0));
        let b = cards.insert(get_card(100, 100));
        let c = cards.insert(get_card(-40, -40));

        let choice_a = "a".to_string();
        let choice_b = "b".to_string();

        let mut hover = Hover::default();
        let hover_a = hover.insert(Some(choice_a.clone()), vec![a]);
        let hover_b = hover.insert(Some(choice_b.clone()), vec![b, c]);

        // Do nothing.
        hover.set_from_choice(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(!cards.values().any(|c| c.dirty));

        // Select.
        hover.set_from_choice(Some(choice_a), &mut cards).unwrap();
        assert_eq!(hover.hovering.unwrap(), hover_a);
        assert!(cards[a].dirty);
        assert!(!cards[b].dirty);

        // Select something else.
        hover.set_from_choice(Some(choice_b), &mut cards).unwrap();
        assert_eq!(hover.hovering.unwrap(), hover_b);
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(cards[c].dirty);

        cards[a].dirty = false;
        cards[b].dirty = false;
        cards[c].dirty = false;

        // Deselect.
        hover.set_from_choice(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(!cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(cards[c].dirty);
    }
}
