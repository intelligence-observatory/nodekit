use crate::error::Error;
use blittle::*;
use nodekit_rs_board::*;
use nodekit_rs_video::FrameExtractor;
use slotmap::new_key_type;
use std::path::Path;
use nodekit_rs_graph::VideoCard;
use crate::components::Card;

new_key_type! { pub struct VideoKey; }

pub struct BlitResult {
    pub blitted: bool,
    pub audio: Option<Vec<u8>>,
}

#[derive(Default)]
pub struct Video<'v> {
    extractor: Option<FrameExtractor<'v>>,
    muted: bool,
    looping: bool,
}

impl From<&VideoCard> for Video<'_> {
    fn from(value: &VideoCard) -> Self {
        Self {
            muted: value.muted,
            looping: value.loop_,
            extractor: None
        }
    }
}

impl Video<'_> {
    pub fn load<P: AsRef<Path>>(
        &mut self,
        path: P,
        card: &Card,
    ) -> Result<(), Error> {
        self.extractor = Some(FrameExtractor::new(path, card.size.w as u32, card.size.h as u32)
            .map_err(Error::FrameExtractor)?);
        Ok(())
    }

    pub fn blit(&mut self, card: &Card, board: &mut Board) -> Result<BlitResult, ffmpeg_next::Error> {
        match self.extractor.as_mut().unwrap().get_next_frame()? {
            Some(frame) => {
                // Blit the video frame.
                blit(
                    frame.video.data(0),
                    &card.size,
                    board,
                    &card.position,
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
