use crate::{EntityState, get_w_h};
use crate::{
    board::*,
    components::card::{Card, get_path},
    error::Error,
};
use blittle::*;
use nodekit_rs_graph::VideoCard;
use nodekit_rs_response::{AudioFrame, VisualFrame};
use nodekit_rs_video::*;
use slotmap::new_key_type;
use std::path::PathBuf;
use std::slice;

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
    pub fn new(path: PathBuf, width: u32, height: u32, muted: bool, looped: bool) -> Self {
        Self {
            path,
            width,
            height,
            muted,
            looped,
            extractor: None,
            ended: false
        }
    }
    
    pub fn from_video_card(card: &VideoCard) -> Result<Self, Error> {
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
        self.extractor = Some(FrameExtractor::new(&self.path, self.muted).map_err(Error::Video)?);
        Ok(())
    }

    /// Blit the next frame and possibly set the audio frame.
    /// Returns true if a blit happened.
    pub fn blit(
        &mut self,
        card: &Card,
        board: &mut [u8],
        audio: &mut Option<AudioFrame>,
    ) -> Result<bool, Error> {
        if card.state == EntityState::StartedNow {
            self.load()?;
        }
        let extractor = self.extractor.as_mut().unwrap();
        let mut done = false;
        let mut blitted = false;
        while !done {
            match extractor.get_next_frame().map_err(Error::Video)? {
                Extraction::Frame(mut frame) => {
                    unsafe {
                        // This is the same code as in `frame.video.data(0)`,
                        // but it's mutable so `resize_buffer` can use it.
                        let data = slice::from_raw_parts_mut(
                            (*frame.video.as_mut_ptr()).data[0],
                            frame.video.stride(0) * frame.video.plane_height(0) as usize,
                        );
                        // Resize.
                        let src = VisualFrame::resize_buffer(
                            data,
                            frame.video.width(),
                            frame.video.height(),
                            self.width,
                            self.height,
                        )
                        .map_err(Error::Visual)?;
                        // Blit the video frame.
                        blit(
                            &src,
                            &card.rect.size,
                            board,
                            &card.rect.position,
                            &BOARD_SIZE,
                            3,
                        );
                    }
                    // Set audio.
                    *audio = frame.audio;
                    // A blit happened.
                    blitted = true;
                    done = true;
                }
                Extraction::NoFrame => (),
                Extraction::EndOfVideo => {
                    done = true;
                    if self.looped {
                        extractor.reset().map_err(Error::Video)?;

                        blitted = true;
                    } else {
                        self.ended = true;
                    }
                }
            }
        }
        Ok(blitted)
    }
    
    pub fn reset(&mut self) -> Result<(), Error> {
        match self.extractor.as_mut() {
            Some(extractor) => extractor.reset().map_err(Error::Video),
            None => Ok(())
        }
    }
}
