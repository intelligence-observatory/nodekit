use std::path::PathBuf;
use blittle::{blit, Size};
use slotmap::new_key_type;
use nodekit_rs_graph::ImageCard;
use nodekit_rs_image::from_png;
use nodekit_rs_visual::*;
use crate::components::card::get_path;
use crate::error::Error;
use crate::rect::Rect;
use crate::{get_w_h, Card};

new_key_type! { pub struct ImageKey; }

pub struct Image {
    path: PathBuf,
    width: u32,
    height: u32
}

impl Image {
    pub fn new(card: &ImageCard) -> Result<Self, Error> {
        let path = get_path(&card.image.locator)?;
        let (width, height) = get_w_h!(card);
        Ok(Self {
            path,
            width,
            height,
        })
    }
    
    pub fn blit(&self, card: &Card, visual: &mut [u8]) -> Result<(), Error> {
        let mut frame = from_png(&self.path).map_err(Error::Image)?;
        frame.resize(self.width, self.height).map_err(Error::Visual)?;
        blit(&frame.buffer, &card.rect.size, visual, &card.rect.position, &VISUAL_SIZE, STRIDE);
        Ok(())
    }
}