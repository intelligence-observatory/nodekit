use std::path::Path;
use blittle::*;
use ffmpeg_next::format::context::input::PacketIter;
use crate::{Board, Extractor, Frames, BOARD_D};

pub struct Video<'v> {
    pub position: PositionU,
    pub size: Size,
    pub extractor: Extractor<'v>,
    pub frames: Vec<Frames>,
}

impl Video<'_> {
    pub fn new<P: AsRef<Path>>(path: P, position: PositionI, mut size: Size) -> Result<Self, ffmpeg_next::Error> {
        let board_size = Size {
            w: BOARD_D,
            h: BOARD_D
        };
        let position = clip(&position, &board_size, &mut size);
        let extractor = Extractor::new(path, size.w as u32, size.h as u32)?;
        Ok(Self {
            position,
            size,
            extractor,
            frames: Vec::default(),
        })
    }

    pub fn extract(&mut self) -> Result<(), ffmpeg_next::Error> {
        if let Some(frames) = self.extractor.next_frames()? {
            self.frames.push(frames);
        }
        Ok(())
    }
}