use crate::nodekit_rect::CardRect;
use crate::{Error, Frame, Rect};
use std::path::Path;

pub struct Image {
    pub image: Vec<u8>,
    pub rect: Rect,
}

impl Image {
    pub fn from_png<P: AsRef<Path>>(path: P, rect: CardRect) -> Result<Self, Error> {
        let mut image = nodekit_rs_image::Image::from_png(path).map_err(Error::Image)?;
        let image = Frame::resize(&mut image.buffer, image.width, image.height, rect.w, rect.h)?;
        let rect = Rect::from(rect);
        Ok(Self { image, rect })
    }
}
