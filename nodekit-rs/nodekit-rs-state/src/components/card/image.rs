use crate::{Card, board::*, components::card::get_path, error::Error, get_w_h};
use blittle::blit;
use nodekit_rs_graph::ImageCard;
use nodekit_rs_image::from_png;
use slotmap::new_key_type;
use std::path::PathBuf;

new_key_type! { pub struct ImageKey; }

pub struct Image {
    path: PathBuf,
    width: u32,
    height: u32,
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

    pub fn blit(&self, card: &Card, board: &mut [u8]) -> Result<(), Error> {
        let mut frame = from_png(&self.path).map_err(Error::Image)?;
        frame
            .resize(self.width, self.height)
            .map_err(Error::Visual)?;
        blit(
            &frame.buffer,
            &card.rect.size,
            board,
            &card.rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
        Ok(())
    }
}
