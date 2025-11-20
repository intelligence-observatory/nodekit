mod error;

pub use error::Error;
use nodekit_rs_models::Card;
use nodekit_rs_visual::*;
use scuffle_ffmpeg::decoder::DecoderOptions;
use scuffle_ffmpeg::{
    AVMediaType, AVPixelFormat, decoder::Decoder, frame::VideoFrame, io::Input, scaler::VideoScaler,
};
use std::fs::read;
use std::io::Cursor;

pub struct Video {
    pub buffer: Vec<u8>,
    pub width: usize,
    pub height: usize,
    pub rect: BlitRect,
}

impl Video {
    pub fn new(card: &Card, video: &nodekit_rs_models::Video) -> Result<Self, Error> {
        // Load the video.
        let buffer = read(&video.path).map_err(|e| Error::FileNotFound(video.path.clone(), e))?;
        let (width, height) = Self::get_size(&buffer)?;
        let rect = BlitRect::from(card.rect);
        Ok(Self {
            buffer,
            rect,
            width,
            height,
        })
    }

    pub fn blit(&self, t_msec: u64, board: &mut [u8]) -> Result<(), Error> {
        let frame = self.get_frame(t_msec)?;
        // Blit.
        blittle::blit(
            &frame,
            &self.rect.size,
            board,
            &self.rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
        Ok(())
    }

    fn get_size(buffer: &[u8]) -> Result<(usize, usize), Error> {
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
            video_decoder.width().cast_unsigned() as usize,
            video_decoder.height().cast_unsigned() as usize,
        ))
    }

    pub fn get_frame(&self, t_msec: u64) -> Result<Vec<u8>, Error> {
        // Open the buffer.
        let cursor = Cursor::new(&self.buffer);
        let mut input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the streams.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        let video_index = streams
            .best_index(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)? as i32;
        let mut video_decoder = Decoder::with_options(
            &video,
            DecoderOptions {
                codec: None,
                thread_count: 2,
            },
        )
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
                while let Ok(Some(f)) = video_decoder.receive_frame() {
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
            self.width.cast_signed() as i32,
            self.height.cast_signed() as i32,
            AVPixelFormat::Rgb24,
        )
        .map_err(Error::Ffmpeg)?;
        let frame = scaler.process(&frame).map_err(Error::Ffmpeg)?;
        let data = frame.data(0).ok_or(Error::NoData)?;
        let width_3 = frame.width() * STRIDE;
        let mut out = vec![0; width_3 * frame.height()];
        for y in 0..self.height {
            let row = data.get_row(y).ok_or(Error::NotEnoughRows(y))?;
            let index = y * width_3;
            out[index..index + width_3].copy_from_slice(&row[0..width_3]);
        }
        Ok(out)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use blittle::PositionU;
    use std::fs::write;

    #[test]
    fn test_framerate() {
        let width = 400;
        let height = 300;

        let rect = BlitRect {
            position: PositionU { x: 0, y: 0 },
            size: blittle::Size {
                w: width,
                h: height,
            },
        };
        let video = Video {
            buffer: include_bytes!("../test-video.mp4").to_vec(),
            width,
            height,
            rect,
        };

        let frame = video.get_frame(300).unwrap();
        let _ = write("out.raw", &frame);
        assert_eq!(frame.len(), (width * height * 3) as usize);
    }
}
