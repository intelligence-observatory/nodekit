use crate::components::*;
use slotmap::{SecondaryMap, SlotMap};

pub enum CardComponentKey {
    Image(ImageKey),
    Text(TextKey),
    Video(VideoKey),
}

#[derive(Default)]
pub struct Cards {
    pub cards: SlotMap<CardKey, Card>,
    pub order: Vec<CardKey>,
    pub components: SecondaryMap<CardKey, CardComponentKey>,
    pub images: SlotMap<ImageKey, (Image, CardKey)>,
    pub text: SlotMap<TextKey, Text>,
    pub videos: SlotMap<VideoKey, (Video, CardKey)>,
}
