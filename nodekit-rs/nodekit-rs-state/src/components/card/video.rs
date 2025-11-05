use crate::{get_w_h, EntityState};
use crate::{
    board::*,
    components::card::{Card, get_path},
    error::Error,
};
use blittle::*;
use nodekit_rs_graph::VideoCard;
use nodekit_rs_response::AudioFrame;
use nodekit_rs_video::*;
use slotmap::new_key_type;
use std::path::PathBuf;

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

    pub fn load(&mut self) -> Result<(), Error> {
        self.extractor = Some(
            FrameExtractor::new(&self.path, self.width, self.height, self.muted)
                .map_err(Error::Video)?,
        );
        Ok(())
    }

    /// Blit the next frame and possibly set the audio frame.
    /// Returns true if a blit happened.
    pub fn blit(
        &mut self,
        card: &Card,
        board: &mut [u8],
        audio: &mut Option<AudioFrame>
    ) -> Result<bool, Error> {
        if card.state == EntityState::StartedNow {
            self.load()?;
        }
        let extractor = self.extractor.as_mut().unwrap();
        match extractor.get_next_frame().map_err(Error::Video)? {
            Extraction::Frame(frame) => {
                println!("HERE");
                // Blit the video frame.
                blit(
                    frame.video.data(0),
                    &card.rect.size,
                    board,
                    &card.rect.position,
                    &BOARD_SIZE,
                    3,
                );
                // Set audio.
                *audio = frame.audio;
                // A blit happened.
                Ok(true)
            }
            Extraction::NoFrame => Ok(false),
            Extraction::EndOfVideo => {
                if self.looped {
                    extractor.reset().map_err(Error::Video)?;
                    // Immediately try to get the next frame.
                    self.blit(card, board, audio)
                } else {
                    self.ended = true;
                    Ok(false)
                }
            }
        }
    }
}
