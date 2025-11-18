mod error;

pub use error::Error;
use scuffle_ffmpeg::decoder::{Decoder, VideoDecoder};
use scuffle_ffmpeg::io::Input;
use scuffle_ffmpeg::scaler::VideoScaler;
use scuffle_ffmpeg::{AVMediaType, AVPixelFormat};
use std::io::Cursor;
use std::ops::{Deref, DerefMut};
use scuffle_ffmpeg::consts::Const;
use scuffle_ffmpeg::frame::VideoFrame;
use scuffle_ffmpeg::stream::Stream;

pub fn get_frame(buffer: &[u8], t_msec: u64, width: u32, height: u32) -> Result<Vec<u8>, Error> {
    // Open the buffer.
    let cursor = Cursor::new(buffer);
    let mut input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
    // Get the streams.
    let streams = input.streams();
    let video = streams
        .best(AVMediaType::Video)
        .ok_or(Error::NoVideoTrack)?;
    let video_index = streams
        .best_index(AVMediaType::Video)
        .ok_or(Error::NoVideoTrack)? as i32;
    let mut video_decoder = Decoder::new(&video)
        .map_err(Error::Ffmpeg)?
        .video()
        .map_err(|_| Error::NotVideoDecoder)?;
    let frame_rate = 1. / video.r_frame_rate().as_f64() * 1000.;
    let mut t0 = 0.;
    let t1 = t_msec as f64;
    let mut frame = None;
    while t0 <= t1 {
        while frame.is_none() {
            let packet = input.receive_packet().unwrap().unwrap();
            if packet.stream_index() == video_index {
                video_decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
                while let Ok(Some(f)) = video_decoder.receive_frame().map_err(Error::Ffmpeg) {
                    frame = Some(f);
                    t0 += frame_rate;
                    if t0 >= t1 {
                        break;
                    }
                };
            }
            if t0 >= t1 {
                break;
            }
        }
    }
    let frame = frame.ok_or(Error::NoFrame(t_msec))?;
    println!("{:?}", frame.best_effort_timestamp());
    let mut scaler = VideoScaler::new(
        frame.width() as i32,
        frame.height() as i32,
        AVPixelFormat::Yuv420p,
        width as i32,
        height as i32,
        AVPixelFormat::Rgb24,
    )
    .map_err(Error::Ffmpeg)?;
    let frame = scaler.process(&frame).map_err(Error::Ffmpeg)?;
    let data = frame.data(0).ok_or(Error::NoData)?;
    let width_3 = frame.width() * 3;
    let mut out = vec![0; width_3 * frame.height()];
    for y in 0..height as usize {
        let row = data.get_row(y).ok_or(Error::NotEnoughRows(y))?;
        let index = y * width_3;
        out[index..index + width_3].copy_from_slice(&row[0..width_3]);
    }
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::write;

    #[test]
    fn test_framerate() {
        let width = 400;
        let height = 300;
        let frame = get_frame(include_bytes!("../test-video.mp4"), 300, width, height).unwrap();
        let _ = write("out.raw", &frame);
        assert_eq!(frame.len(), (width * height * 3) as usize);
    }
}
