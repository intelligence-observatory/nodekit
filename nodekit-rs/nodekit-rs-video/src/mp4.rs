use std::io::{Cursor, Read, Seek};
use mp4::{Error, Mp4Reader, Mp4Sample, Mp4Track, Result, TrackType};

pub fn get_sample(buffer: &[u8], t_msec: u64) -> Result<Option<Mp4Sample>> {
    // Open the buffer.
    let cursor = Cursor::new(buffer);
    let mut mp4 = mp4::Mp4Reader::read_header(cursor, buffer.len() as u64)?;
    // Get the video track.
    let (track_id, track) = get_video_track(&mp4)?;
    // Get the index of the sample at `t_msec`.
    let sample_index = get_sample_index(track, t_msec);
    // https://github.com/alfg/mp4-rust/blob/master/examples/mp4sample.rs#L33
    let sample_id = sample_index + 1;
    mp4.read_sample(track_id, sample_id)
}

fn get_video_track<R: Read + Seek>(mp4: &Mp4Reader<R>) -> Result<(u32, &Mp4Track)> {
    mp4.tracks().iter().find_map(|(id, track)| match track.track_type() {
        Ok(TrackType::Video) => Some((*id, track)),
        _ => None
    }).ok_or(Error::InvalidData("Failed to find a video track!"))
}

fn get_sample_index(track: &Mp4Track, t_msec: u64) -> u32 {
    (track.frame_rate() * ((t_msec as f64 / 1000.) / track.duration().as_secs_f64())) as u32
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
        let mut mp4 = Mp4Reader::read_header(reader, size).unwrap();
        let (track_id, track) = get_video_track(&mp4).unwrap();
        assert_eq!(track.frame_rate() as u64, 60);

        assert_eq!(track.sample_count(), 120);
        assert_eq!(track.duration().as_millis(), 2000);
        assert_eq!(get_sample_index(track, 0), 0);
        assert_eq!(get_sample_index(track, 33), 0);
        assert_eq!(get_sample_index(track, 34), 1);
        assert_eq!(get_sample_index(track, 126), 3);

        assert_eq!(track.width(), 512);
        assert_eq!(track.height(), 512);
        assert_eq!(track.trak.mdia, 512);

        let sample = mp4.read_sample(track_id, 13).unwrap().unwrap();
        assert_eq!(sample.rendering_offset, 512);
        assert_eq!(sample.bytes.len(), 512);
    }
}