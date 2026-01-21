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
            .and_then(|hovering| self.hoverables.get(hovering))
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
        let mut hoverables = HashMap::<String, Vec<CardKey>>::default();
        let choice_a = "a".to_string();
        let choice_b = "b".to_string();
        hoverables.insert(choice_a.clone(), vec![a]);
        hoverables.insert(choice_b.clone(), vec![b]);
        let mut hover = Hover {
            hoverables,
            hovering: None,
        };

        // Do nothing.
        hover.set(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(!cards.values().any(|c| c.dirty));

        // Select.
        hover.set(Some(choice_a.clone()), &mut cards).unwrap();
        assert_eq!(hover.hovering.as_ref().unwrap(), &choice_a);
        assert!(cards[a].dirty);
        assert!(!cards[b].dirty);

        // Select something else.
        hover.set(Some(choice_b.clone()), &mut cards).unwrap();
        assert_eq!(hover.hovering.as_ref().unwrap(), &choice_b);
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(!cards[c].dirty);

        // Invalid key.
        assert!(hover.set(Some("c".to_string()), &mut cards).is_err());
        // Nothing changed.
        assert_eq!(hover.hovering.as_ref().unwrap(), &choice_b);
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(!cards[c].dirty);

        // Deselect.
        hover.set(None, &mut cards).unwrap();
        assert!(hover.hovering.is_none());
        assert!(cards[a].dirty);
        assert!(cards[b].dirty);
        assert!(!cards[c].dirty);
    }
}
