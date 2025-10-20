use crate::{BOARD_SIZE, Board};
use blittle::*;
use std::path::Path;
use nodekit_rs_video::FrameExtractor;
use crate::error::Error;

pub struct BlitResult {
    pub blitted: bool,
    pub audio: Option<Vec<u8>>,
}

pub struct Video<'v> {
    pub position: PositionU,
    pub size: Size,
    pub extractor: FrameExtractor<'v>,
}

impl Video<'_> {
    pub fn new<P: AsRef<Path>>(
        path: P,
        position: PositionI,
        mut size: Size,
    ) -> Result<Self, Error> {
        let position = clip(&position, &BOARD_SIZE, &mut size);
        let extractor = FrameExtractor::new(path, size.w as u32, size.h as u32).map_err(Error::FrameExtractor)?;
        Ok(Self {
            position,
            size,
            extractor,
        })
    }

    pub fn blit(&mut self, board: &mut Board) -> Result<BlitResult, ffmpeg_next::Error> {
        match self.extractor.get_next_frame()? {
            Some(frame) => {
                // Blit the video frame.
                blit(
                    frame.video.data(0),
                    &self.size,
                    board,
                    &self.position,
                    &BOARD_SIZE,
                    3,
                );
                // Return audio.
                let audio = frame.audio.map(|audio| audio.data(0).to_vec());
                Ok(BlitResult {
                    blitted: true,
                    audio,
                })
            }
            None => Ok(BlitResult {
                blitted: false,
                audio: None,
            }),
        }
    }
}
