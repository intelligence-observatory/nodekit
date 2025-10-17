mod components;
mod entity;

use slotmap::{SecondaryMap, SlotMap};

pub use components::*;
pub use entity::Entity;
use nodekit_rs_fb::{Graph, MediaType};

#[derive(Default)]
pub struct Node {
    pub entities: SlotMap<Entity, ()>,
    pub cards: SecondaryMap<Entity, Card>,
    pub timers: SecondaryMap<Entity, Timer>,
    pub images: SecondaryMap<Entity, AssetLoader>,
    pub text: SecondaryMap<Entity, Text>,
    pub videos: SecondaryMap<Entity, AssetLoader>,
}

impl Node {
    pub fn deserialize(&mut self, graph: Graph) {
        if let Some(cards) = graph.cards() {
            self.deserialize_cards(cards);
        }
    }

    fn deserialize_cards<'c>(
        &mut self,
        cards: flatbuffers::Vector<'c, flatbuffers::ForwardsUOffset<nodekit_rs_fb::Card<'c>>>,
    ) {
        cards.iter().for_each(|card| {
            let entity = self.entities.insert(());
            self.cards.insert(entity, Card::from(&card));
            self.timers.insert(entity, Timer::from(&card));

            // Deserialize the card time.
            match card.card_type_as_text() {
                Some(text) => {
                    self.text.insert(entity, Text::from(text));
                }
                None => {
                    let _ = self.deserialize_asset(entity, &card);
                }
            }
        })
    }

    fn deserialize_asset(&mut self, entity: Entity, card: &nodekit_rs_fb::Card) -> Option<()> {
        let asset = card.card_type_as_asset()?;
        let asset_loader = AssetLoader::new(&asset)?;
        match asset.media_type() {
            MediaType::Image => {
                self.images.insert(entity, asset_loader);
            }
            MediaType::Video => {
                self.videos.insert(entity, asset_loader);
            }
            other => unreachable!("Invalid media type: {}", other.0),
        }
        Some(())
    }
}
