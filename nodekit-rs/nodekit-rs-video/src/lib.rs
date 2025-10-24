//! This crate provides the means of extracting frame data from a video.
//! It doesn't provide any blitting or processing functionality.

mod extraction;
mod extractors;

pub use extraction::Extraction;
use extractors::*;
use ffmpeg_next::{Error, format::input};
use std::path::Path;

macro_rules! extract {
    ($extractor:ident, $frame:ident, $packet:ident, $frame_index:ident, $target_frame:ident, $eof:ident) => {{
        match $extractor.try_extract_frame(&$packet) {
            Ok(()) => {
                // Got the frame!
                if *$frame_index == $target_frame {
                    $frame = Some($extractor.frame.data(0).to_vec());
                } else {
                    *$frame_index += 1;
                }
            }
            Err(error) => {
                if let Error::Eof = error {
                    $eof = true;
                }
            }
        }
    }};
}

pub fn extract_frame<P: AsRef<Path>>(
    path: P,
    time_msec: f64,
    muted: bool,
    audio_frame_index: &mut usize,
    video_frame_index: &mut usize,
) -> Result<Extraction, Error> {
    let mut input = input(path.as_ref())?;
    // Try to get an audio extractor.
    let mut audio = if muted {
        None
    } else {
        AudioExtractor::new(&input).ok()
    };
    let has_audio = audio.is_some();
    // Always get a video extractor.
    let mut video = VideoExtractor::new(&input)?;
    // Get the target frame, given the time and the frame rate.
    let target_frame = video.get_target_frame(time_msec);
    // This will be `Some` when we get to the target frame.
    let mut video_frame = None;
    // This will be `Some` if there is audio and we get to the target frame.
    let mut audio_frame = None;
    let mut video_eof = false;
    let mut audio_eof = false;
    for (stream, packet) in input.packets() {
        let stream_index = stream.index();
        // Send the packet to the video decoder.
        if stream_index == video.stream_index && !video_eof {
            extract!(
                video,
                video_frame,
                packet,
                video_frame_index,
                target_frame,
                video_eof
            );
        } else if !audio_eof
            && let Some(audio) = audio.as_mut()
            && stream_index == audio.stream_index
        {
            extract!(
                audio,
                audio_frame,
                packet,
                audio_frame_index,
                target_frame,
                audio_eof
            );
        }
        // End of file.
        if video_eof && (!has_audio || audio_eof) {
            return Ok(Extraction::EndOfVideo);
        }
        // RustRover doesn't like this but it compiles.
        if (!has_audio || audio_frame.is_some())
            && let Some(video_frame) = video_frame
        {
            return Ok(Extraction::Frame {
                video: video_frame,
                audio: audio_frame,
            });
        }
    }
    Err(Error::BufferTooSmall)
}
