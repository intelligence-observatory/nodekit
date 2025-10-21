use crate::components::*;
use slotmap::{Key, SecondaryMap, SlotMap};
use crate::systems::SubSystem;

#[derive(Default)]
pub struct CardsSystem<T: Key, U> {
    pub components: SlotMap<T, U>,
    pub cards: SecondaryMap<T, CardKey>
}

#[derive(Default)]
pub struct Cards<'c> {
    pub cards: SlotMap<CardKey, Card>,
    pub timers: SecondaryMap<CardKey, TimerKey>,
    pub images: SubSystem<ImageKey, CardKey, Image>,
    pub text: SubSystem<TextKey, CardKey, Text>,
    pub videos: SubSystem<VideoKey, CardKey, Video<'c>>,
}