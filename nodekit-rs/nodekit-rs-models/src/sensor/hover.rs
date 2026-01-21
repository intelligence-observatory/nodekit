use crate::CardKey;
use hashbrown::HashMap;

pub struct Hover {
    pub hoverable: HashMap<String, Vec<CardKey>>,
    pub hovering: Option<String>,
}
