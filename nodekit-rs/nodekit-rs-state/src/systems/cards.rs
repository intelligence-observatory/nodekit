use crate::components::*;
use crate::systems::SubSystem;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Default)]
pub struct Cards<'c> {
    pub cards: SlotMap<CardKey, Card>,
    pub timers: SecondaryMap<CardKey, TimerKey>,
    pub images: SubSystem<ImageKey, CardKey, Image>,
    pub text: SubSystem<TextKey, CardKey, Text>,
    pub videos: SubSystem<VideoKey, CardKey, Video<'c>>,
}
