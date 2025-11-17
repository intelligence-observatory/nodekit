use std::io::{Cursor, Read, Seek};
use mp4::{Error, Mp4Reader, Mp4Track, Result, TrackType};

pub fn get_sample(buffer: &[u8], t_msec: u64) -> Result<()> {
    // Open the buffer.
    let cursor = Cursor::new(buffer);
    let mut mp4 = mp4::Mp4Reader::read_header(cursor, buffer.len() as u64)?;

    let track = get_video_track(&mp4)?;
    let sample_index = track.frame_rate() as u64 * t_msec;
    Ok(())
}

fn get_video_track<R: Read + Seek>(mp4: &Mp4Reader<R>) -> Result<&Mp4Track> {
    mp4.tracks().iter().find_map(|(_, track)| match track.track_type() {
        Ok(TrackType::Video) => Some(track),
        _ => None
    }).ok_or(Error::InvalidData("Failed to find a video track!"))
}

fn get_sample_index(track: &Mp4Track, t_msec: u64) -> u64 {
    (track.frame_rate() * ((t_msec as f64 / 1000.) / track.duration().as_secs_f64())) as u64
}

#[cfg(test)]
mod tests {
    use std::fs::File;
    use std::io::BufReader;
    use super::*;

    #[test]
    fn test_framerate() {
        let f = File::open("test-video.mp4").unwrap();
        let size = f.metadata().unwrap().len();
        let reader = BufReader::new(f);
        let mp4 = mp4::Mp4Reader::read_header(reader, size).unwrap();
        let track = get_video_track(&mp4).unwrap();
        assert_eq!(track.frame_rate() as u64, 60);

        assert_eq!(track.sample_count(), 120);
        assert_eq!(track.duration().as_millis(), 2000);
        assert_eq!(get_sample_index(track, 0), 0);
        assert_eq!(get_sample_index(track, 33), 0);
        assert_eq!(get_sample_index(track, 34), 1);
        assert_eq!(get_sample_index(track, 126), 3);

    }
}