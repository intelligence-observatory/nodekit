use crate::components::*;
use crate::systems::SubSystem;
use slotmap::SlotMap;

#[derive(Default)]
pub struct Cards<'c> {
    pub cards: SlotMap<CardKey, Card>,
    pub images: SubSystem<ImageKey, CardKey, Image>,
    pub text: SubSystem<TextKey, CardKey, Text>,
    pub videos: SubSystem<VideoKey, CardKey, Video<'c>>,
}
