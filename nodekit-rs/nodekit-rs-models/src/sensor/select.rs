use super::hover::Hover;
use crate::CardKey;
use hashbrown::HashSet;

pub struct Select {
    pub hover: Hover,
    pub selected: HashSet<String>,
}
