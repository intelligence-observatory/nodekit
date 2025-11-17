mod error;

pub use error::Error;
use scuffle_ffmpeg::codec::EncoderCodec;
use scuffle_ffmpeg::decoder::Decoder;
use scuffle_ffmpeg::encoder::{Encoder, VideoEncoderSettings};
use scuffle_ffmpeg::io::{Input, Output, OutputOptions};
use scuffle_ffmpeg::{AVCodecID, AVMediaType, AVPictureType, AVPixelFormat};
use std::io::Cursor;
use scuffle_ffmpeg::frame::VideoFrame;

pub fn get_frame(
    buffer: &[u8],
    t_msec: u64,
    width: u32,
    height: u32,
) -> Result<Vec<u8>, Error> {
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
        .video().map_err(|_| Error::NotVideoDecoder)?;
    let video_settings = VideoEncoderSettings::builder()
        .width(width.cast_signed())
        .height(height.cast_signed())
        .pixel_format(AVPixelFormat::Yuv420p)
        .frame_rate(video_decoder.frame_rate())
        .build();
    let codec = EncoderCodec::new(AVCodecID::RawVideo).ok_or(Error::X264)?;
    let mut output = Output::seekable(
        Cursor::new(Vec::default()),
        OutputOptions::builder().format_name("rawvideo").map_err(Error::Ffmpeg)?.build(),
    ).map_err(Error::Ffmpeg)?;
    let mut video_encoder = Encoder::new(
        codec,
        &mut output,
        video.time_base(),
        video.time_base(),
        video_settings,
    ).map_err(Error::Ffmpeg)?;
    output.write_header().map_err(Error::Ffmpeg)?;
    let mut frame = None;
    while frame.is_none() {
        let packet = input.receive_packet().unwrap().unwrap();
        if packet.stream_index() == video_index {
            video_decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
            frame = video_decoder.receive_frame().map_err(Error::Ffmpeg)?;
        }
    }
    let frame = frame.unwrap();
    println!("{} {} {:?} {:?}", frame.width(), frame.height(), frame.pts(), frame.format());
    video_encoder.send_frame(&frame).map_err(Error::Ffmpeg)?;
    while let Some(packet) = video_encoder.receive_packet().map_err(Error::Ffmpeg)? {
        println!("{}", packet.stream_index());
        output.write_packet(&packet).map_err(Error::Ffmpeg)?;
    }
    output.write_trailer().unwrap();
    Ok(output.into_inner().into_inner())
}


#[cfg(test)]
mod tests {
    use std::fs::write;
    use super::*;

    #[test]
    fn test_framerate() {
        let width = 400;
        let height = 300;
        let frame = get_frame(include_bytes!("../test-video.mp4"), 0, width, height).unwrap();
        let _ = write("out.raw", &frame);
        assert_eq!(frame.len(), (width * height * 3) as usize);
    }
}
