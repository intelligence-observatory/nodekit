use crate::card_rect::CardRect;
use crate::{Error, Frame, Rect};
use nodekit_rs_video::{Audio, Extraction};
use std::path::Path;

pub struct Video {
    pub video: Vec<u8>,
    pub audio: Option<Audio>,
    pub rect: Rect,
}

impl Video {
    pub fn from_file<P: AsRef<Path>>(
        path: P,
        time_msec: f64,
        muted: bool,
        looped: bool,
        rect: CardRect,
    ) -> Result<Option<Self>, Error> {
        let mut audio_index = 0;
        let mut video_index = 0;
        if looped {
            let mut extraction = Extraction::EndOfVideo;
            while let Extraction::EndOfVideo = extraction {
                extraction = nodekit_rs_video::extract_frame(
                    path.as_ref(),
                    time_msec,
                    muted,
                    &mut audio_index,
                    &mut video_index,
                )
                .map_err(Error::Video)?;
            }
            match extraction {
                Extraction::Frame { video, audio } => Self::new(video, audio, rect),
                Extraction::EndOfVideo => unreachable!("This is impossible!"),
            }
        } else {
            let extraction = nodekit_rs_video::extract_frame(
                path,
                time_msec,
                muted,
                &mut audio_index,
                &mut video_index,
            )
            .map_err(Error::Video)?;
            match extraction {
                Extraction::Frame { video, audio } => Self::new(video, audio, rect),
                Extraction::EndOfVideo => Ok(None),
            }
        }
    }

    fn new(
        mut video: nodekit_rs_video::Video,
        audio: Option<Audio>,
        rect: CardRect,
    ) -> Result<Option<Self>, Error> {
        let video = Frame::resize(&mut video.frame, video.width, video.height, rect.w, rect.h)?;
        let rect = Rect::from(rect);
        Ok(Some(Self { video, audio, rect }))
    }
}
