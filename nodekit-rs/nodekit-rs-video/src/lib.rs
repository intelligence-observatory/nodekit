mod error;

use bytemuck::cast_slice;
pub use error::Error;
use nodekit_rs_models::Card;
use nodekit_rs_visual::*;
use scuffle_ffmpeg::{
    AVMediaType, AVPixelFormat, decoder::Decoder, frame::VideoFrame, io::Input, scaler::VideoScaler,
};
use std::fs::read;
use std::io::Cursor;

pub fn blit(card: &Card, video: &nodekit_rs_models::Video, board: &mut [u8]) -> Result<(), Error> {
    // Load the video.
    let buffer = read(&video.path).map_err(|e| Error::FileNotFound(video.path.clone(), e))?;
    let (width, height) = get_size(&buffer)?;
    let rect = ResizedRect::new(&card.rect, width, height);
    let frame = get_frame(&buffer, video.t_msec, rect.width, rect.height)?;

    // Convert to RGBA.
    // TODO this is too slow. Fix it!
    let mut buffer_rgba = vec![[255; 4]; rect.width as usize * rect.height as usize];
    for (src, dst) in cast_slice::<u8, [u8; 3]>(&frame)
        .iter()
        .zip(buffer_rgba.iter_mut())
    {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
    }

    // Blit.
    let blit_rect = BlitRect::from(rect.rect);
    blittle::blit(
        cast_slice::<[u8; 4], u8>(&buffer_rgba),
        &blit_rect.size,
        board,
        &blit_rect.position,
        &BOARD_SIZE,
        STRIDE,
    );
    Ok(())
}

pub fn get_size(buffer: &[u8]) -> Result<(u32, u32), Error> {
    let cursor = Cursor::new(buffer);
    let input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
    // Get the streams.
    let streams = input.streams();
    let video = streams
        .best(AVMediaType::Video)
        .ok_or(Error::NoVideoTrack)?;
    let video_decoder = Decoder::new(&video)
        .map_err(Error::Ffmpeg)?
        .video()
        .map_err(|_| Error::NotVideoDecoder)?;
    Ok((
        video_decoder.width().cast_unsigned(),
        video_decoder.height().cast_unsigned(),
    ))
}

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
    let mut frame_index = 0;
    let target_frame_index = (t_msec as f64 / 1000. * video.r_frame_rate().as_f64()) as usize;
    let mut frame: Option<VideoFrame> = None;
    let mut got_frame = false;
    for packet in input.packets() {
        let packet = packet.map_err(Error::Ffmpeg)?;
        if packet.stream_index() == video_index {
            video_decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
            while let Ok(Some(f)) = video_decoder.receive_frame().map_err(Error::Ffmpeg) {
                frame = Some(f);
                frame_index += 1;
                if frame_index >= target_frame_index {
                    got_frame = true;
                    break;
                }
            }
        }
        if got_frame {
            break;
        }
    }
    let frame = frame.ok_or(Error::NoFrame(t_msec))?;
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
