mod audio_params;
mod error;
mod extractor;
mod write;

use error::Error;
use extractor::{AudioExtractor, VideoExtractor};
use ffmpeg_next::format::input;
use std::fs::{File, OpenOptions, read, remove_file};
use std::io::{Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use write::*;

pub fn extract<P: AsRef<Path>>(
    src_file: P,
    dst_directory: P,
    width: u32,
    height: u32,
) -> Result<(), Error> {
    // Get the file stem of the source file.
    let filename = src_file
        .as_ref()
        .file_stem()
        .ok_or(Error::Filename(src_file.as_ref().to_path_buf()))?;
    // Open the audio and video files.
    let audio_path = dst_directory
        .as_ref()
        .join(PathBuf::from(format!("{:?}_audio.raw", filename)));
    let mut audio_file = File::create(&audio_path).map_err(Error::Io)?;
    let video_path = dst_directory.as_ref().join(PathBuf::from(format!(
        "{:?}_video_{width}x{height}.raw",
        filename
    )));
    let mut video_file = File::create(&video_path).map_err(Error::Io)?;

    // Write the video dimensions.
    write_u32(&mut video_file, width)?;
    write_u32(&mut video_file, height)?;

    // Reserve space to write the frame count.
    write_usize(&mut video_file, 0)?;

    // Get the extractors.
    let mut input = input(src_file.as_ref()).map_err(Error::Ffmpeg)?;
    let mut audio = AudioExtractor::new(&input).map_err(Error::Ffmpeg);
    let mut video = VideoExtractor::new(&input, width, height).map_err(Error::Ffmpeg)?;

    // Write audio params.
    let mut has_audio = false;
    if let Ok(audio) = audio.as_ref() {
        let audio_params = audio.get_params();
        audio_params.write(&mut audio_file)?;
        has_audio = true;
    }

    let mut num_frames = 0usize;
    // Extract.
    for (stream, packet) in input.packets() {
        let index = stream.index();
        // Extract video.
        if index == video.stream_index() {
            video.send_packet(&packet).map_err(Error::Ffmpeg)?;
            while let Ok(b) = video.extract_next_frame() {
                video_file.write_all(b).map_err(Error::Io)?;
                num_frames += 1;
            }
        } else {
            // Try to extract audio.
            if let Ok(audio) = audio.as_mut() {
                if index == audio.stream_index() {
                    audio.send_packet(&packet).map_err(Error::Ffmpeg)?;
                    while let Ok(b) = audio.extract_next_frame() {
                        audio_file.write_all(b).map_err(Error::Io)?
                    }
                }
            }
        }
    }

    // Write the frame count.
    video_file.seek(SeekFrom::Start(8)).map_err(Error::Io)?;
    write_usize(&mut video_file, num_frames)?;
    println!("{num_frames}");

    drop(audio_file);
    if has_audio {
        // Concatenate the two files.
        let audio = read(&audio_path).map_err(Error::Io)?;
        let mut video_file = OpenOptions::new()
            .append(true)
            .open(&video_path)
            .map_err(Error::Io)?;
        video_file.write_all(&audio).map_err(Error::Io)?;

        // Delete the audio file.
        remove_file(audio_path).map_err(Error::Io)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::extract::extract;

    #[test]
    fn test_extraction() {
        extract("BigBuckBunny_320x180.mp4", ".", 256, 256).unwrap();
    }
}
