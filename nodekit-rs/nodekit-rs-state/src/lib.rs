mod components;
mod error;
mod node;
mod systems;
mod transition;

use blittle::Size;
use slotmap::{SecondaryMap, SlotMap};
use crate::node::{Node, NodeKey};
use crate::transition::Transition;

pub struct State<'s> {
    start: NodeKey,
    nodes: SlotMap<NodeKey, Node<'s>>,
    transitions: SecondaryMap<NodeKey, Transition>,
    nodekit_version: String,
}