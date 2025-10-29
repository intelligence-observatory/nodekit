use hashbrown::HashMap;
use crate::CardKey;
use crate::systems::Cards;

pub struct CardsResult {
    pub cards: Cards,
    pub card_ids: HashMap<String, CardKey>,
}