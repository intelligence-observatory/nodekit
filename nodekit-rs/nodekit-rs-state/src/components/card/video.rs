use crate::{
    error::Error,
    components::Card,
    board::*
};
use blittle::*;
use nodekit_rs_graph::VideoCard;
use nodekit_rs_video::*;
use slotmap::new_key_type;
use std::path::Path;

new_key_type! { pub struct VideoKey; }

#[derive(Default)]
pub struct VideoResult {
    pub blitted: bool,
    pub audio: Option<Vec<u8>>,
}

#[derive(Default)]
pub struct Video {
    extractor: Option<FrameExtractor>,
    muted: bool,
    looping: bool,
    ended: bool,
}

impl From<&VideoCard> for Video {
    fn from(value: &VideoCard) -> Self {
        Self {
            muted: value.muted,
            looping: value.loop_,
            extractor: None,
            ended: false,
        }
    }
}

impl Video {
    pub fn load<P: AsRef<Path>>(&mut self, path: P, card: &Card) -> Result<(), Error> {
        self.extractor = Some(
            FrameExtractor::new(
                path,
                card.rect.size.w as u32,
                card.rect.size.h as u32,
                self.muted,
            )
            .map_err(Error::Video)?,
        );
        Ok(())
    }

    pub fn blit(
        &mut self,
        card: &Card,
        board: &mut [u8],
    ) -> Result<VideoResult, ffmpeg_next::Error> {
        let extractor = self.extractor.as_mut().unwrap();
        match extractor.get_next_frame()? {
            Extraction::Frame(frame) => {
                // Blit the video frame.
                blit(
                    frame.video.data(0),
                    &card.rect.size,
                    board,
                    &card.rect.position,
                    &BOARD_SIZE,
                    3,
                );
                // Return audio.
                let audio = frame.audio.map(|audio| audio.data(0).to_vec());
                Ok(VideoResult {
                    blitted: true,
                    audio,
                })
            }
            Extraction::NoFrame => Ok(VideoResult::default()),
            Extraction::EndOfVideo => {
                if self.looping {
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
