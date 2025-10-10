mod extractor;

use crate::extract::extractor::{AudioExtractor, VideoExtractor};
use ffmpeg_next::Error;
use ffmpeg_next::format::input;
use std::path::Path;

pub fn extract<P: AsRef<Path>>(src: P, width: u32, height: u32) -> Result<(), Error> {
    let mut input = input(src.as_ref())?;
    let mut audio = AudioExtractor::new(&input)?;
    let mut video = VideoExtractor::new(&input, width, height)?;
    // Extract.
    for (stream, packet) in input.packets() {
        let index = stream.index();
        if index == audio.stream_index() {
            let b = audio.extract_next_frame(&packet)?;
            println!("audio {}", b.len());
        } else if index == video.stream_index() {
            let b = video.extract_next_frame(&packet)?;
            println!("video {}", b.len());
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::extract::extract;

    #[test]
    fn test_extraction() {
        extract("mp4.ia.mp4", 256, 256).unwrap();
    }
}
