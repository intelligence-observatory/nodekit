use crate::get_w_h;
use crate::{
    components::card::{Card, get_path},
    error::Error,
};
use blittle::*;
use nodekit_rs_board::*;
use nodekit_rs_graph::VideoCard;
use nodekit_rs_response::AudioFrame;
use nodekit_rs_video::*;
use slotmap::new_key_type;
use std::path::{Path, PathBuf};

new_key_type! { pub struct VideoKey; }

#[derive(Default)]
pub struct VideoResult {
    pub blitted: bool,
    pub audio: Option<AudioFrame>,
}

pub struct Video {
    path: PathBuf,
    width: u32,
    height: u32,
    extractor: Option<FrameExtractor>,
    muted: bool,
    looped: bool,
    ended: bool,
}

impl Video {
    pub fn new(card: &VideoCard) -> Result<Self, Error> {
        let (width, height) = get_w_h!(card);
        Ok(Self {
            path: get_path(&card.video.locator)?,
            width,
            height,
            muted: card.muted,
            looped: card.loop_,
            extractor: None,
            ended: false,
        })
    }

    pub fn load<P: AsRef<Path>>(&mut self) -> Result<(), Error> {
        self.extractor = Some(
            FrameExtractor::new(&self.path, self.width, self.height, self.muted)
                .map_err(Error::Video)?,
        );
        Ok(())
    }

    pub fn blit(
        &mut self,
        card: &Card,
        board: &mut [u8],
    ) -> Result<VideoResult, nodekit_rs_video::Error> {
        let extractor = self.extractor.as_mut().unwrap();
        match extractor.get_next_frame()? {
            Extraction::Frame(frame) => {
                // Blit the video frame.
                blit(
                    frame.video.data(0),
                    &card.rect.size,
                    board,
                    &card.rect.position,
                    &VISUAL_SIZE,
                    3,
                );
                // Return audio.
                Ok(VideoResult {
                    blitted: true,
                    audio: frame.audio,
                })
            }
            Extraction::NoFrame => Ok(VideoResult::default()),
            Extraction::EndOfVideo => {
                if self.looped {
                    extractor.reset()?;
                    // Immediately try to get the next frame.
                    self.blit(card, board)
                } else {
                    self.ended = true;
                    Ok(VideoResult::default())
                }
            }
        }
    }
}
