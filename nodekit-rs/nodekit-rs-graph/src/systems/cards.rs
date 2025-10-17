use crate::{AssetLoader, Card, CardKey, Text, Timer, deserialize_system};
use nodekit_rs_fb::MediaType;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Default)]
pub struct Cards {
    pub cards: SlotMap<CardKey, Card>,
    pub timers: SecondaryMap<CardKey, Timer>,
    pub images: SecondaryMap<CardKey, AssetLoader>,
    pub text: SecondaryMap<CardKey, Text>,
    pub videos: SecondaryMap<CardKey, AssetLoader>,
}

impl Cards {
    deserialize_system!(CardKey, card);

    fn deserialize_card<'c>(&mut self, card: &nodekit_rs_fb::Card<'c>) -> (&'c str, CardKey) {
        let card_key = self.cards.insert(Card::from(card));
        if let Some(timer) = card.timer() {
            self.timers.insert(card_key, Timer::from(timer));
        }
        // Deserialize the card time.
        match card.card_type_as_text() {
            Some(text) => {
                self.text.insert(card_key, Text::from(text));
            }
            None => {
                let _ = self.deserialize_asset(card_key, card);
            }
        }
        (card.id().unwrap(), card_key)
    }

    fn deserialize_asset(&mut self, card_key: CardKey, card: &nodekit_rs_fb::Card) -> Option<()> {
        let asset = card.card_type_as_asset()?;
        let asset_loader = AssetLoader::new(&asset)?;
        match asset.media_type() {
            MediaType::Image => {
                self.images.insert(card_key, asset_loader);
            }
            MediaType::Video => {
                self.videos.insert(card_key, asset_loader);
            }
            other => unreachable!("Invalid media type: {}", other.0),
        }
        Some(())
    }
}
