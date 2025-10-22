use crate::components::*;
use slotmap::{SecondaryMap, SlotMap};

pub enum CardComponentKey {
    Image(ImageKey),
    Text(TextKey),
    Video(VideoKey)
}

#[derive(Default)]
pub struct Cards<'c> {
    pub cards: SlotMap<CardKey, Card>,
    pub components: SecondaryMap<CardKey, CardComponentKey>,
    pub images: SlotMap<ImageKey, Image>,
    pub text: SlotMap<TextKey, Text>,
    pub videos: SlotMap<VideoKey, Video<'c>>,
}
