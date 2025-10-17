use slotmap::SlotMap;
use crate::entity::Entity;

mod entity;
mod components;

#[derive(Default)]
pub struct Node {
    entities: SlotMap<Entity, ()>
}