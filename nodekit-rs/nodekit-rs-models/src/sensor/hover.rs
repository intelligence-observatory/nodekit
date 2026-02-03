use crate::card::{Card, CardKey};
use crate::sensor::error::ChoiceKeyError;
use hashbrown::HashMap;
use slotmap::{SlotMap, new_key_type};

new_key_type! { pub struct HoverKey; }

/// Listen for mouse hovering.
#[derive(Default)]
pub struct Hover {
    pub(crate) cards: SlotMap<HoverKey, Vec<CardKey>>,
    /// String IDs from raw model data.
    pub(crate) choices: HashMap<String, HoverKey>,
    /// The key of the card(s) that receive hovering overlays.
    hovering: Option<HoverKey>,
}

impl Hover {
    pub fn set(
        &mut self,
        choice: Option<String>,
        cards: &mut SlotMap<CardKey, Card>,
    ) -> Result<(), ChoiceKeyError> {
        match choice.as_ref() {
            Some(choice) => match self.choices.get(choice) {
                Some(key) => {
                    // Deselect.
                    if let Some(hovering) = self.hovering {
                        self.cards[hovering]
                            .iter()
                            .for_each(|k| cards[*k].dirty = true);
                    }
                    // Select.
                    self.cards[*key].iter().for_each(|k| cards[*k].dirty = true);
                    self.hovering = Some(*key);
                    Ok(())
                }
                None => Err(ChoiceKeyError(choice.clone())),
            },
            None => {
                // Deselect.
                if let Some(hovering) = self.hovering {
                    self.cards[hovering]
                        .iter()
                        .for_each(|k| cards[*k].dirty = true);
                    self.hovering = None;
                }
                Ok(())
            }
        }
    }

    pub fn get_hovering_over(&self) -> Option<&Vec<CardKey>> {
        self.hovering.map(|k| &self.cards[k])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::card::*;
    use crate::sensor::tests::get_card;

    #[test]
    fn test_hover() {
        let mut cards = SlotMap::<CardKey, Card>::default();
        let a = cards.insert(get_card(0, 0));
        let b = cards.insert(get_card(100, 100));
        let c = cards.insert(get_card(-40, -40));
        let mut hover_cards = SlotMap::<HoverKey, Vec<CardKey>>::default();
        let hover_a = hover_cards.insert(vec![a]);
        let hover_b = hover_cards.insert(vec![b, c]);
        let choice_a = "a".to_string();
        let choice_b = "b".to_string();
        let mut choices = HashMap::new();
        choices.insert(choice_a.clone(), hover_a);
        choices.insert(choice_b.clone(), hover_b);
        let mut hover = Hover {
            cards: hover_cards,
            choices,
            hovering: None,
        };

        // Do nothing.
        hover.set(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(!cards.values().any(|c| c.dirty));

        // Select.
        hover.set(Some(choice_a), &mut cards).unwrap();
        assert_eq!(hover.hovering.unwrap(), hover_a);
        assert!(cards[a].dirty);
        assert!(!cards[b].dirty);

        // Select something else.
        hover.set(Some(choice_b), &mut cards).unwrap();
        assert_eq!(hover.hovering.unwrap(), hover_b);
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(cards[c].dirty);

        cards[a].dirty = false;
        cards[b].dirty = false;
        cards[c].dirty = false;

        // Deselect.
        hover.set(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(!cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(cards[c].dirty);
    }
}
