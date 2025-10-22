use crate::components::*;
use nodekit_rs_image::Image;
use slotmap::{SecondaryMap, SlotMap};

pub enum CardComponentKey {
    Image(ImageKey),
    Text(TextKey),
    Video(VideoKey),
}

#[derive(Default)]
pub struct Cards {
    pub cards: SlotMap<CardKey, Card>,
    pub components: SecondaryMap<CardKey, CardComponentKey>,
    pub images: SlotMap<ImageKey, Image>,
    pub image_cards: SecondaryMap<ImageKey, CardKey>,
    pub text: SlotMap<TextKey, Text>,
    pub videos: SlotMap<VideoKey, Video>,
    pub video_cards: SecondaryMap<VideoKey, CardKey>,
}
