use crate::CardKey;
use crate::systems::Cards;
use hashbrown::HashMap;

pub struct CardsResult {
    pub cards: Cards,
    pub card_ids: HashMap<String, CardKey>,
}
