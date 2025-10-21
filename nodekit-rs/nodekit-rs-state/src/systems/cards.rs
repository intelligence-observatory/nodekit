use crate::components::*;
use crate::systems::SubSystem;
use slotmap::{Key, SecondaryMap, SlotMap};
use nodekit_rs_asset::{Asset, AssetManager};

#[derive(Default)]
pub struct CardsSystem<T: Key, U> {
    pub components: SlotMap<T, U>,
    pub cards: SecondaryMap<T, CardKey>,
}

#[derive(Default)]
pub struct Cards<'c> {
    pub cards: SlotMap<CardKey, Card>,
    pub timers: SecondaryMap<CardKey, TimerKey>,
    pub images: SubSystem<ImageKey, CardKey, Image>,
    pub text: SubSystem<TextKey, CardKey, Text>,
    pub videos: SubSystem<VideoKey, CardKey, Video<'c>>,
}

impl Cards<'_> {
    pub fn new(node: &nodekit_rs_graph::Node, asset_manager: &mut AssetManager) -> Self {
        
    }
    
    pub fn set_assets(&mut self, assets: Vec<Asset>) {
        for asset in assets {
            // TODO
        }
    }
}