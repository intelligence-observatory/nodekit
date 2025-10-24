//! This crate provides the means of extracting frame data from a video.
//! It doesn't provide any blitting or processing functionality.

mod extraction;
mod extractors;
mod size;

pub use extraction::Extraction;
use extractors::*;
use ffmpeg_next::{Error, format::input};
pub use size::Size;
use std::path::Path;

pub fn extract_frame<P: AsRef<Path>>(
    path: P,
    time_msec: f64,
    muted: bool,
    audio_index: &mut usize,
    video_index: &mut usize,
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
            match video.try_extract_frame(&packet) {
                Ok(()) => {
                    // Got the frame!
                    if *video_index == target_frame {
                        video_frame = Some(video.frame()?.data(0).to_vec());
                    } else {
                        *video_index += 1;
                    }
                }
                Err(error) => {
                    if let Error::Eof = error {
                        video_eof = true;
                    }
                }
            }
        } else if !audio_eof
            && let Some(audio) = audio.as_mut()
            && stream_index == audio.stream_index
        {
            match audio.try_extract_frame(&packet) {
                Ok(()) => {
                    // Got the frame!
                    if *audio_index == target_frame {
                        audio_frame = Some(audio.frame.data(0).to_vec());
                    } else {
                        *audio_index += 1;
                    }
                }
                Err(error) => {
                    if let Error::Eof = error {
                        audio_eof = true;
                    }
                }
            }
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
                size: video.size,
            });
        }
    }
    Err(Error::BufferTooSmall)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_frame_extraction() {
        let mut audio_index = 0;
        let mut video_index = 0;
        let extraction = extract_frame(
            "../mp4.ia.mp4",
            0.,
            false,
            &mut audio_index,
            &mut video_index,
        )
        .unwrap();
        if let Extraction::Frame { video, audio, size } = extraction {
            assert_eq!(size.width, 854);
            assert_eq!(size.height, 480);
            // assert_eq!(video.len(), (size.width * size.height * 3) as usize);
            assert_eq!(audio.unwrap().len(), 8192);
        } else {
            panic!("Failed to get a frame!")
        }
    }
}
